---
title: "Bulk Delete Cloudflare DNS Records"
description: "Cloudflare doesn't let you bulk delete in the UI. In this blog, we show you how to use Python script to bulk delete DNS records in Cloudflare."
slug: "bulk-delete-clouflare-dns"
date: 2021-12-23T13:00:00Z
draft: false
featuredImage: /assets/2021/12/12-23-bulk-delete-cf-full.png  
featuredImagePreview: /assets/2021/12/12-23-bulk-delete-cf-full.png
images: [/assets/2021/12/12-23-bulk-delete-cf-social.png]
seo:
  images: [/assets/2021/12/12-23-bulk-delete-cf-social.png]
lightgallery: true
tags: [cloudflare,dns]
author: Mike 'MJ' Johnson
code: 
  maxShownLines: 50
---
<!--more-->

[Cloudflare](https://www.cloudflare.com/) is a powerful platform that can help with numerous aspects of managing and securing your infrastructure. We will cover some of the other features in future blogs, but I highly recommend that you look into how Cloudflare can help you or your organization.

In this blog we will discuss a mildly annoying feature of Cloudflare. 

**You can't easily delete DNS records in bulk.**

We rely on Cloudflare for our DNS record management. It allows you to protect the actual source IP behind the Cloudflare proxy network and enables DDOS and other protection (enabling the proxy is optional).

We also use Cloudflare for many trainings, demos and general testing. Often, we create lots of records manually for demonstration purposes, but when it comes time to delete them, you have to delete them. One.... At.... A.... Time.

Luckily, we can leverage a simple python script to delete the records in bulk.

## The Bulk Delete Script

{{< admonition type=warning title="WARNING" open=true >}}
Bulk deleting DNS records is generally NOT advised. Cloudflare likely does not allow for it in the UI because you could seriously mess up your production infrastructure by bulk deleting records you shouldn't. Make CERTAIN that you intend to delete ALL records in a Zone. Use this script at your own risk. 

YOU HAVE BEEN WARNED.
{{< /admonition >}}

Now that you have read the above warning, let's look at the script.

The [Python](https://www.python.org/) script has a few components:

- `zoneid`: This field indicates the ID of the DNS zone you want to delete records from. You can get zone ID from Overview page on the bottom right section.
- `bearer_token`: This is an API key from your Cloudflare interface that allows you to modify DNS records. More information on creating this [here](https://developers.cloudflare.com/api/tokens/create)
- Fetch Records: This section queries the specified DNS Zone for records
- Delete Records: This section actually deletes the record discovered in the Fetch section

```python
import json
import requests

# You can get zone ID from Overview page on the bottom right section
zoneid = "YOUR_ZONE_ID"

# You need to generate api token from My Profile > API Token with Edit Zone permission
bearer_token = "YOUR_BEARER_TOKEN"

if input("Are you sure you want to delete ALL DNS records in this zone? (y/n)") != "y":
    exit()


# Fetch dns records from CloudFlare
record_rq = requests.get("https://api.cloudflare.com/client/v4/zones/"+ zoneid +"/dns_records", headers = {"Content-Type": "application/json", "Authorization": "Bearer " + bearer_token})
data = record_rq.json()
if data['success'] == False:
    print("Failed to fetch dns record:")
    print(data['errors'])
    quit()

# Delete dns records
for record in data['result']:
    print("Deleting:", record['name'])
    rq = requests.delete("https://api.cloudflare.com/client/v4/zones/"+ zoneid +"/dns_records/" + record['id'], headers = {"Content-Type": "application/json", "Authorization": "Bearer " + bearer_token})
    print(rq.status_code, "\n")
```

## Running The Script

1. Create a new file on a system that has `python3` installed. 

On a Mac or Linux system:

```
vi cloudflare-bulk-delete-dns.py
```

2. Past the contents from the above script into that file. Make sure you update the `zoneid` and `bearer_token` fields with your own specific information.

3. Run the script with the following command *after you have read the above warning*. 
```
python3 cloudflare-bulk-delete-dns.py
```

4. Wait for the script to delete all DNS records in that zone.


## Closing

Hopefully this script saves you some time in the future when cleaning up DNS records.

If you want help implementing Cloudflare DNS or other features for your enterprise, please reach out to us at info@alphbravo.io

That's all for now!

---

*The AB Engineering Team*

**Website:** https://alphabravo.io

**Contact Us:** https://alphabravo.io/contact-us