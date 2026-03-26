# Assignment Solutions

## 1. Question 1
If we have an application hosted on a domain(like example.com), and we have to migrate the application to a new domain(like test.com) with Zero Downtime, then we have to follow these few steps:

1. **Configure the New Domain:**
   - First of all we have to purchase a new Domain and also a new SSL certificate or use a free SSL from Let's Encrypt.
   - After that we have to set up the DNS record, and for that:
     - We have to go to the Domain Registrar Portal(like GoDaddy, Namecheap), then locate DNS Management panel/Manage DNS.
     - Then create a new Record, with options like:
       - Type: 'A'
       - Name: @
       - Value: Public IPv4 of our application
       - TTL: Default
2. **Server Update:**
   - Then we have to configure our web server(with nginx.conf file) to serve both domain.
   - Also update any base url, API endpoints or hardcoded links if required.
3. **Verify Application:**
   - Test the new domain thoroughly.
   - Check if it is working fine or having any issue.
   - In this stage, both URLs should work perfectly.
4. **Redirecting Old Domain to New Domain:**
   - Now once our new domain is working fine, then we can just redirect the traffic from old domain to new domain.
   - Configure the old domain with a 301 permanent redirect from old to new domain.
   - This ensures that users are automatically redirected.
   - Also SEO ranking is preserved.
5. **Monitor & Maintain:**
   - Now all these things are done, the final step is to monitor the logs, traffic and errors.
   - We can remove the old domain, when most users are using the new domain, no traffic is coming to old domain, Search engines have updated the links etc.

---

## 2. Question 2
If we already have a domain(like domain.com), and from that I need to create a new subdomain(like api.domain.com), then we have to follow these steps.

1. **Create DNS record for Sub domain:**
   - Go to Domain Registrar Portal(like GoDaddy, Namecheap), then locate DNS Management panel/Manage DNS.
   - Add a new DNS record:
     - Type: 'A'
     - Name: 'api'
     - Value: Public IPv4 of our application
     - TTL: Default
   - This will map 'api.domain.com' to our application.
   - Also for SSL certificate we can use a new one or a free one from Let's Encrypt.
2. **Configure Web Server:**
   - Update the web server(with nginx.conf file) to handle the subdomain.
   - This routes traffic from subdomain to our application.
3. **Configure Application:**
   - Update the application settings if needed:
     - Base URL to new api.domain.com
     - CORS Settings
     - Environment variables
4. **Verify:**
   - Open the new domain(api.domain.com), and verify:
     - API responses
     - SSL working
     - No CORS or routing related issue

---

## 3. Question 3
If we purchase a domain from GoDaddy and use Amazon Web Services (AWS) for hosting, then we can connect the frontend to the main domain (domain.com) and configure the backend on a subdomain (api.domain.com) using the following steps:

1. **Configure Domain with AWS Route 53:**
   - Login to AWS account, search for Route 53, then create a Hosted Zone for 'domain.com'
   - AWS will give 4 nameservers.
   - Then login to GoDaddy, go to DNS Management and replace the default Name servers with the 4 provided by AWS.
   - Now AWS Route 53 controls all our domain records.
2. **Connecting the Frontend:**
   - So most modern frontends on AWS are hosted in S3 bucket or via Cloudfront(CDN).
   - If using CloudFront:
   - Type: A
   - Name: @ 
   - Value: CloudFront distribution 
   - If using S3 static hosting:
   - Then we can use CNAME.
3. **Configuring the Backend:**
   - In Route 53, create a new record:
   - Type: 'A'
   - Name: 'api'
   - Value: Public IPv4 of our application
   - TTL: Default
4. **Configure Web Server / API:**
   - Setup NGINX or app server on backend 
   - Allow requests from frontend domain 
   - Configure CORS properly
5. **Enable HTTPS (SSL):**
   - Use AWS Certificate Manager (ACM)
   - Attach certificates to:
     - CloudFront (frontend)
     - Load Balancer / API (backend)
6. **Verify Setup:**
   - Open:
     - https://domain.com for frontend
     - https://api.domain.com for backend 
   - Test API calls from frontend