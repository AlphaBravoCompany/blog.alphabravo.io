---
title: "Why We Chose Nifi Over Databrew"
slug: "why-we-chose-nifi-over-databrew"
date: 2021-11-22T13:00:00Z
draft: false
featuredImage: /assets/apache-nifi-full.png
featuredImagePreview: /assets/apache-nifi-full.png
images: ["/assets/ab-seo-large.png"]
seo:
  images: ["/assets/ab-seo-large.png"]
lightgallery: true
tags: [apache nifi, aws databrew, etl]
author: Ed Engelking
---

## Why AlphaBravo Chose Nifi Over Databrew

Recently, the AlphaBravo engineering team began working on a new product we’re calling ABScan. Our goal is to provide a platform which uses multiple scanning utilities via a single interface.

Early on in our development process, we realized that we would need to take multiple JSON outputs, convert them into CSV and SQL, and merge the results.  This would require the use of an ETL to automate the transformation of the data generated so we could create CSV files for reports and SQL data for long term storage.

## What is an ETL?
ETL stands for “Extract, Transform, and Load”.  It is a term used when dealing with data, data warehousing, and data analytics.  It is a means of bringing in data from multiple sources into a centralized system, such as a database.  It works by performing the following work:

- **Extract**: Collect data from an originating source, such as one or more scanning applications.
- **Transform**: Manipulate the data by merging, deduplication, formatting.
- **Load**: Using the transformed data sources, load the information into a file or database.

## What is AWS Gule Databrew?
When we first began working on the project, we explored ETL platforms which could get us to market as quickly as possible. Given our regular use of the Amazon Web Services (AWS) platform, we reviewed the options available and [found Glue Databrew](https://aws.amazon.com/glue/features/databrew/).

Glue Databrew is a visual data preparation tool which allows for easy cleaning and normalization of data in preparation for use with analytics and machine learning.  The engineering team discovered we could easily upload a dataset, create repeatable recipes for our ETL purposes, and save our results to a database or S3 bucket.

The stand-out feature for Databrew is it’s easy to use interface and time-to-market, in addition to easily integrating into AWS platforms and services.

## What is Apache Nifi?
During our discovery phase, we also [researched Apache’s Nifi](https://nifi.apache.org/).  Much like AWS Glue Databrew, Apache Nifi provides a visual data preparation tool to clean and normalize data. Using a series of processors, Nifi can extract data from multiple sources, create multiple workflows for ETL purposes, and save the results to a database or S3 bucket.

The stand-out feature for Nifi, as compared to AWS, is its ability to allow AlphaBravo to be platform agnostic, whereas Databrew is hard wired into the AWS ecosystem. Nifi also scales exceptionally well and is incredibly fast.
What Databrew Does Well
During our testing with Databrew, we discovered that the interface is incredibly simple to understand and use. The engineering team were able to create multiple workflow samples within a day, and by the end of day two, we were able to ingest multiple data samples, perform ETL work, merge all of the results into a single dataset, and load the results into an S3 bucket or database.

Given that Databrew is a part of the AWS ecosystem, it’s trivial to automate against the platform using multiple toolsets. The AWS CLI works exceptionally well, as does the SDK toolsets, such as the BOTO SDK for Python. Using these tools, we were able to get Databrew completely integrated into our automation pipeline within a few days.

Using the UI, the team was able to build easy to use recipes, which we could apply to our sample datasets and return the same result time and time again, as long as the dataset matched the expectations of the recipe.

Once we had agreed upon the recipes for our sample datasets, we were able to use these recipes to create jobs with associated datasets to perform the ETL workload.  Overall, from start to finish the process rarely took over a few minutes to complete.

## What Databrew Lacks
For all of its features, Databrew does have a few weaknesses which made us decide to move off the platform towards something else.

### Limits

One of the biggest issues we encountered while using Glue Databrew was the [inherent limits of the platform](https://docs.aws.amazon.com/databrew/latest/dg/quotas.html).  Out of the box, only 10 jobs could be running at any given time. While we could reach out to AWS to increase this limit (and we did), each time we hit a hard limit we would have to reach out to support to resolve the issue. 

Support would be able to increase the limit, given a good enough reason was provided to do so. Our concern here was we might need to increase the limit significantly at some point but AWS would be slow to handle the increase, or worse, be unwilling to do so.


### Timeouts

During our testing process, we encountered a significant number of timeout issues. We realized this was due to the total number of calls being made against the AWS API, and was the result of the engineering team working in parallel and making a non-trivial number of calls to the platform at any given time.

We reached out to support to see what we could do to solve these problems, however we were informed that the only way to solve the issue would be to [build in logic to throttle API calls over time](https://docs.aws.amazon.com/general/latest/gr/api-retries.html) to prevent the timeout from occurring.  This would be a difficult problem to solve over time as we expected to continue to increase API calls as the platform grew, and we were experiencing severe timeouts even during a simple POC.


### Recipe Issues

We discovered after running a significant number of datasets that we might have extra information in one random dataset as compared to the rest.  Unfortunately, if a recipe is not expecting the extra data, or if data is missing for any reason, the job will fail as the recipe does not understand how to continue.

Unfortunately, there is no current method to build in conditions in a given recipe, so the entire job would fail.  Further, this would require the team to test a significant number of data samples, determine how any given data sample might fail, and build a specific recipe for the use case.  We would then have to build logic to determine what recipes a given dataset would require and build the job around those requirements.


### Job Spin-up Time

Glue Databrew is a “just-in-time” platform, meaning the jobs engine stays offline until a call is made to spin up the underlying servers to run a given job.  As a result, it can take some time, especially for larger datasets, to complete as each job submitted must wait for the platform to come online.

Our average jobs would take a few minutes each to run.  Given the limit issue mentioned earlier, this would also become a blocker for other jobs in queue and quickly create a backlog from our automation system. The more people submit data, the longer the last person who created a submission must wait.


### Work Required for Automation Integration

To automate against Glue Databrew, a series of actions must be written to perform work against the service.

- A dataset must be created, referencing a data source such as a database or S3 bucket.
- A recipe which will work against the dataset must exist or be uploaded. Given that someone can inadvertently delete a recipe from the UI as there’s no way to lock them, it makes sense to upload the recipe as each dataset is created.
- A means to validate the dataset and recipe have uploaded successfully before a job is submitted.
- A job submission, which references the dataset and recipe.
- A method to validate the total number of jobs currently in progress to avoid hitting limits and failure.
- A timeout function to prevent too many calls from being made against the API, and to back off on API calls over time to prevent the timeout from occurring.
- A method to verify when a job is complete to determine if the ETL process has completed and the data has output successfully.

## What Nifi Does Well
As with Databrew, the Apache Nifi platform has a very simple and easy to use interface.  Out of the box, it provides [a significant number of processors](https://nifi.apache.org/docs.html) which are used to handle many kinds of data workflows. 

Nifi easily integrates with many cloud platforms and service providers, providing simple methods to extract data.  It can query and load many different database platforms, message queues, email, APIs, streaming services, logs, ftp, etc.  And if you cannot find a processor to fit your needs, you can create your own and import it into the service.

Once data has been pulled into the platform, Nifi can easily transform the data and move it along in different workflows. For example, I can pull a JSON document from a message queue, extract the information contained in the file to set one or more attributes, create a flowfile using the attributes, deduplicate and sort the information in the flowfile, merge the contents into a new CSV file, and store the newly created CSV file into an S3 bucket.

Did I mention Nifi is fast?  It can do all of the work mentioned above in less than a second. In testing, the AphaBravo engineering team has thrown significant amounts of data at Nifi and has been able to retrieve data within a second or two.

## What Nifi Lacks
While Nifi is powerful, it does have a few significant limitations as compared to Glue Databrew which had to be considered:


### Self-Hosted

Apache Nifi currently, as of the time of this writing, does not have a hosted service available. As such, we had to spin up our own environment. This has a lot of added complexity as compared to Glue Databrew, we have to build out a platform which is powerful enough to process our data without breaking the bank.

This also means the engineering team must work on regular updates for the product, as well as manage configurations and securing secrets, which adds additional overhead for the use of the product.


### Scalability

Given the Nifi platform is self-hosted, the AlphaBravo team must also take into account the need to scale the platform on-demand. While Glue Databrew can be easily scaled by submitting a support request to increase limits, scale for Nifi must be planned, and preferably, managed automatically.

When load on the platform is low, we will not need multiple Nifi nodes. However, if and when we receive regular or bursting traffic, there is a possibility of bottlenecks if we don’t have a means to scale, which can cause ever increasing wait times for users of the platform.


### Always On

Unlike Glue Databrew Jobs, Apache Nifi is always on and listening for input. This is, in part, what makes it so fast to process data.  However, the downside is the requirements for infrastructure which is always online and must be highly available.


### Lack of Informative Documentation

While the Nifi platform has a significant amount of documentation, it’s not very informative. There have been several instances during the POC where a processor was introduced and experienced failures because the documentation was not very clear to the expectations of work.

As an example, database integration can be tricky to set up. A user must first find the related processor, for example, “ExecuteSQL”.  In order to use this processor, a database connection pooling service must be assigned.  If this controller service does not yet exist, it must be created and configured.

When setting up the controller service for the database connection pool, you must know the following:


- **The database connection URL:** Not only do you need the URL itself, but [you must use the exact syntax required by your DBMS](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-usagenotes-connect-drivermanager.html).
Example: jdbc:mysql://mydatabase:3306


- **The database driver class name:** The name of the driver class to use for connectivity. This is usually [provided via the database documentation](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-usagenotes-connect-drivermanager.html), and isn’t referenced in the Nifi documentation.
Example: com.mysql.jdbc.Driver


- **The location of the database driver on the host node:** Generally, the driver is not installed with Nifi. You must [download the driver](https://dev.mysql.com/downloads/connector/j/), upload it to the hosted node(s), extract the driver, and store it in a directory which Nifi can access.
**Example:** /opt/nifi/nifi-current/drivers/mysql

## So Why Did We Choose Nifi over Databrew?
After a significant amount of testing with these two platforms, the AphaBravo engineering team chose Nifi for the following reasons, in no particular order:

### Popularity

Nifi is a very, very popular toolset in the ETL community. It is used by many large organizations, as well as government entities. Nifi itself [originated from the NSA](https://www.fedscoop.com/nsa-open-source-nifi/S), based on the NiagraFiles software which was open sourced by the NSA in 2014.


### Age of the Nifi Project

Nifi was originally open sourced in 2014, and has an active community. Glue Databrew was released at the end of 2020, but the Glue platform on which it is based was originally released in 2017.


### Platform Agnostic 

While Glue Databrew is tightly integrated with AWS, Nifi works with all major cloud providers and a host of 3rd party tool sets. This allows the engineering team to host Nifi in many different environments and allows movement from platform to platform without breaking functionality.


### Ability to Scale

Nifi scale is only limited to the AlphaBravo team’s capabilities, and is not based on arbitrary limits set by a cloud provider.  We could, in theory, scale the platform indefinitely should the need to do so arise.


### Speed

Nifi is fast. So fast, in fact, we had to build in timing mechanisms in certain workflows during our POC because the data was collecting so quickly that multiple files were being created inadvertently during data merge processes. We introduced bin timeouts to solve this problem.  As a result, the slowest workflow takes approximately 10 seconds to complete end to end.

---

**Ed Engelking** - *AlphaBravo Principal Engineer*

---

**Website:** https://alphabravo.io

**Contact Us:** https://alphabravo.io/contact-us
