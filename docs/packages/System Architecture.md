# System Architecture

## Overview

The Monitoring Platform follows a centralized observability architecture.

Its responsibility is to collect events from applications and operating systems, process and categorize those events, store them centrally, and expose them through APIs and a monitoring dashboard.

## High-Level Architecture

```text
                  ┌───────────────────────────┐
                  │       DATA SOURCES        │
                  └─────────────┬─────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
              ▼                                   ▼
      ┌─────────────────┐                 ┌─────────────────┐
      │   Linux Agent   │                 │ Technology SDKs │
      │                 │                 │                 │
      │ CPU             │                 │ Errors          │
      │ Memory          │                 │ Logs            │
      │ Disk            │                 │ Stack Traces    │
      │ Processes       │                 │ Requests        │
      │ Network         │                 │ Performance     │
      └────────┬────────┘                 └────────┬────────┘
               │                                   │
               └─────────────────┬─────────────────┘
                                 ▼
                    ┌────────────────────────┐
                    │   Event Collector API  │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │      Event Queue       │
                    │   Redis / BullMQ        │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   Processing Engine     │
                    │                        │
                    │ Parse                   │
                    │ Filter                  │
                    │ Categorize              │
                    │ Detect Issues           │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │     MongoDB Storage     │
                    │                        │
                    │ Logs                    │
                    │ Errors                  │
                    │ Metrics                 │
                    │ Traces                  │
                    └────────────┬───────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
          ┌──────────────────┐      ┌──────────────────┐
          │ Dashboard / REST │      │ Alerting System  │
          │ API              │      │                  │
          │                  │      │ Email/Webhooks   │
          │ Search           │      │ Slack            │
          │ Monitoring       │      │                  │
          │ Analytics        │      │                  │
          └────────┬─────────┘      └──────────────────┘
                   │
                   ▼
             Developers /
             On-call Teams
