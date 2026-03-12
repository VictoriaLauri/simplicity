# Project Context

This repository contains early development work for SimpliCity, a property advice platform currently being explored through the SimpliCity Engineering Circle.

SimpliCity is being developed based on the product definition in the Product Requirements Document (PRD). AI assistants should treat the PRD as the primary source of truth for product behaviour and features.

The purpose of this repository is to explore architecture, implement an MVP, and simulate a collaborative engineering environment.

## Product Overview

SimpliCity is a two-sided marketplace connecting property experts with users seeking professional advice.

The MVP focuses on discovery and connection, allowing:

- property experts to showcase services
- users to discover experts and save relevant offers
- users to book advice sessions via external booking links

The platform does not currently handle transactions, messaging, or payments.

Those capabilities may be explored in later iterations.

## Core Value Proposition

### For Users

A centralized directory of vetted property experts with transparent service offerings.

Users can:

- browse services
- view expert profiles
- favourite services
- book consultations via external booking links

### For Experts

Experts gain a professional profile and service listing capability to attract qualified leads.

Experts can:

- create and manage their profile
- list services
- provide booking links for consultations

## MVP Feature Scope

The MVP focuses on the following capabilities.

### Roles

Two platform roles exist:

- **User (Seeker):** Individuals seeking advice related to property decisions.
- **Expert (Provider):** Property professionals offering paid consultation services.

### Authentication

Both roles must be able to:

- register
- log in
- access role-specific dashboards

### Expert Features

Experts can manage their presence on the platform through an Expert Dashboard.

Capabilities include:

- editing profile information
- uploading a profile photo
- specifying expert level and area of expertise
- creating service listings
- deleting service listings

Service listings contain:

- title
- description
- price
- external booking link (e.g., Calendly)

### User Features

Users have access to a User Dashboard.

Capabilities include:

- editing profile details
- specifying their property role (buyer, renter, landlord, etc.)
- saving services to a favourites list

The favourites list allows users to track services they may wish to book later.

### Discovery

Users can browse available services through a service listing feed.

Each service card contains:

- service title
- price
- short description
- expert name
- link to expert profile

Users can:

- favourite services
- open booking links
- navigate to expert profiles

### Expert Profiles

Each expert has a public profile page displaying:

- profile photo
- name
- expert level
- area of expertise
- services offered

### Out of Scope for MVP

The following features are intentionally not included in the MVP:

- on-platform payments
- booking system
- messaging or video consultations
- reviews or ratings
- search and filtering

These may be considered in future iterations.

## Technical Architecture

The MVP architecture is defined in the PRD and should be followed unless a deliberate architectural change is discussed.

### Frontend

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS

UI principles:

- responsive design
- accessible components
- clear navigation between discovery and dashboards

### Backend

Application logic is handled through:

- Next.js server actions
- API routes where necessary

### Database

- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma

### Authentication

Authentication may be handled via:

- Supabase Auth
- NextAuth

### File Storage

Profile photos are stored using Supabase Storage.

### Data Model

The core domain entities include:

- **User:** Represents authenticated platform accounts.
- **ExpertProfile:** Stores expert-specific profile data.
- **UserProfile:** Stores user-specific profile data.
- **Service:** Represents an advice offering created by an expert.
- **Favorite:** Stores relationships between users and saved services.

AI assistants may suggest schema updates when required to support agreed user stories, page flows, or data integrity; such changes should be documented and raised for review.

## Engineering Circle Context

This repository is being developed through the SimpliCity Engineering Circle, an 8-week collaborative initiative.

The goal is to simulate a real engineering environment while allowing contributors to participate alongside their full-time roles.

The initiative focuses on:

- architecture exploration
- collaborative development
- documentation
- producing portfolio-quality work

The objective is learning and architectural clarity, not shipping a production-ready platform within 8 weeks.

## Roles in the Engineering Circle

### Junior Engineers

Juniors primarily contribute through implementation work.

Responsibilities include:

- implementing features
- writing documentation
- opening pull requests
- proposing solutions

### Senior Engineers

Senior engineers primarily provide guidance.

Responsibilities include:

- reviewing pull requests
- advising on architecture
- suggesting improvements

Senior engineers are not expected to implement large volumes of code.

## When Senior Review Is Needed

AI assistants should recommend senior review when work affects:

- database schema
- authentication architecture
- service data structure
- core product flows
- infrastructure decisions

Routine implementation work typically does not require senior review.

## Guidance for AI Assistants

AI assistants should act as technical advisors, helping contributors improve maintainability and structure.

Suggestions should prioritize:

- clear architecture
- simple implementations
- maintainable code
- documented decisions

Avoid introducing unnecessary complexity or premature abstractions.

If a change affects architecture or product direction, recommend creating a GitHub issue for discussion before implementation.