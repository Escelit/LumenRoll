---
name: Bug Report
description: File a bug report to help us improve LumenRoll
title: "[BUG]: "
labels: ["bug", "triage"]
assignees: []
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report! Please provide as much detail as possible.

  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: A clear and concise description of what the bug is
      placeholder: Describe the bug you encountered
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: Steps to reproduce the behavior
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What you expected to happen
      placeholder: Describe what should have happened
    validations:
      required: true

  - type: textarea
    id: actual
    attributes:
      label: Actual Behavior
      description: What actually happened
      placeholder: Describe what actually happened instead
    validations:
      required: true

  - type: dropdown
    id: component
    attributes:
      label: Component
      description: Which component is affected?
      options:
        - Smart Contract
        - Backend API
        - Frontend UI
        - Wallet Integration
        - Documentation
        - Other
    validations:
      required: true

  - type: dropdown
    id: severity
    attributes:
      label: Severity
      description: How severe is this bug?
      options:
        - Critical - Blocks all functionality
        - High - Major functionality broken
        - Medium - Some functionality affected
        - Low - Minor issue or cosmetic
    validations:
      required: true

  - type: input
    id: environment
    attributes:
      label: Environment
      description: What environment are you running?
      placeholder: e.g., Chrome 124, Windows 11, Testnet
    validations:
      required: true

  - type: textarea
    id: logs
    attributes:
      label: Logs / Screenshots
      description: Add any relevant logs, error messages, or screenshots
      placeholder: Paste logs or drag and drop screenshots here

  - type: textarea
    id: additional
    attributes:
      label: Additional Context
      description: Any other context about the problem
      placeholder: Add any other relevant information

  - type: checkboxes
    id: terms
    attributes:
      label: Confirmation
      description: Please confirm the following
      options:
        - label: I have searched existing issues for this bug
          required: true
        - label: I have provided enough information to reproduce the issue
          required: true
        - label: This is not a security vulnerability (use security@lumenroll.io for security issues)
          required: true
