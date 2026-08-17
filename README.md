# Problem Statement

Modern applications, especially microservice-based systems, generate a large amount of logs and system events. When an error occurs, developers often need to search through multiple services, files, terminals, and code paths to identify the source of the problem.

For example, commands such as grep -R "error" can help locate errors, but this approach becomes inefficient as the project grows. It is difficult to correlate application errors with system-level problems such as high CPU usage, memory issues, disk problems, network failures, DNS errors, or suspicious activity.

This project aims to solve this problem by building a centralized monitoring and log management platform inspired by tools such as Sentry.

The platform will collect application logs, errors, warnings, system information, metrics, and other events from different sources and provide them through a centralized dashboard. This allows developers and system administrators to search, analyze, monitor, and identify issues from a single location.

## What We are building
We are building a centralized monitoring and observability platform for applications and Linux-based systems.

The platform will consist of:

- Linux/system monitoring agents
- Technology-specific SDKs
- Event Collector REST API
- Event processing engine
- Event queue for buffering and asynchronous processing
- Centralized MongoDB storage
- Dashboard and REST API
- Alerting and notification system

The overall goal is to provide a single place where developers can understand the health of their applications and infrastructure.

# Core Features

## 1. Application Error Monitoring

The platform will collect application-level events such as:

- Errors
- Warnings
- Fatal errors
- Informational logs
- Stack traces
- Exceptions
- API/request failures
- Performance-related events

Each event can contain useful contextual information such as timestamp, service, environment, request information, and error details.

## 2. Linux System Monitoring

A Linux monitoring agent will collect system-level information such as:

- CPU usage
- Memory usage
- Disk usage
- Running processes
- Network information
- System events
- Resource-related failures

This allows application problems to be analyzed together with the underlying system state.

## 3. Network and Infrastructure Monitoring

The platform will be designed to detect and record infrastructure-related issues such as:

- Network connectivity failures
- DNS resolution problems
- Port connectivity issues
- Connection failures
- Service availability problems

## 4. Suspicious Activity Detection

The monitoring system will collect events that may indicate unusual or suspicious behavior.

Examples include:

- Unexpected processes
- Unusual network activity
- Repeated failed requests
- Abnormal resource usage
- Unexpected service behavior

The initial implementation will focus on collecting and identifying such events rather than providing a full security/SIEM solution.

## 5. Centralized Log Management

Instead of checking logs separately across multiple services, logs will be collected and stored centrally.

The system will categorize events into areas such as:

- Logs
- Errors
- Metrics
- Traces
- System events
- Network events

This makes searching and debugging significantly easier.

## 6. Event Processing

Incoming events will pass through a processing layer responsible for:

- Parsing events
- Validating data
- Filtering unnecessary information
- Categorizing events
- Detecting potential issues
- Preparing data for storage
  
## 7. Monitoring Dashboard

The frontend dashboard will provide:

- Log search
- Error search
- Live monitoring
- System statistics
- Analytics
- Event details
- Alerts
- Service-level information

The objective is to allow developers to understand the state of their system without manually searching through individual services.

## 8. Alerts and Notifications

Important events can eventually trigger notifications through mechanisms such as:

_Webhooks
- Email
- Slack
- Other supported notification channels

This will allow developers or on-call teams to become aware of critical failures without continuously watching the dashboard.

