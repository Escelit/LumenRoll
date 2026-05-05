# Contributing to LumenRoll

Thank you for your interest in contributing to LumenRoll! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Getting Started

### Prerequisites

Before contributing, ensure you have the following tools installed:

- **Rust** (1.74+) for smart contract development
- **Node.js** (18+) for backend and frontend
- **PostgreSQL** (14+) for backend database
- **Stellar CLI** (0.9+) for contract deployment
- **Git** for version control

### Development Workflow

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes with tests
4. Submit a pull request

## Development Setup

### 1. Clone and Setup

```bash
git clone https://github.com/your-username/LumenRoll.git
cd LumenRoll
```

### 2. Smart Contract Development

```bash
cd contract
cargo test
make build
make deploy-testnet  # For testing
```

### 3. Backend Development

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
npm run migrate
npm run dev
```

### 4. Frontend Development

```bash
cd frontend
cp .env.example .env
# Edit .env with your API configuration
npm install
npm run dev
```

## Project Structure

```
LumenRoll/
├── contract/                   # Soroban smart contract (Rust)
│   ├── src/lib.rs             # Main contract logic
│   ├── Cargo.toml             # Rust dependencies
│   └── Makefile               # Build/deployment scripts
├── backend/                   # Node.js API server
│   ├── src/
│   │   ├── index.js           # Express server entry
│   │   ├── routes/            # API route handlers
│   │   ├── services/          # Business logic services
│   │   └── db/               # Database schema
│   └── package.json           # Node.js dependencies
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility libraries
│   │   └── App.jsx           # Main application
│   └── package.json           # Frontend dependencies
└── scripts/                   # Deployment and utility scripts
```

## Contributing Guidelines

### Types of Contributions

We welcome the following types of contributions:

1. **Bug Fixes** - Fix reported issues in the codebase
2. **New Features** - Add new functionality
3. **Documentation** - Improve existing documentation
4. **Performance** - Optimize code for better performance
5. **Security** - Identify and fix security vulnerabilities
6. **Testing** - Add or improve test coverage

### Areas Where Help is Welcome

- **Smart Contract Features**
  - Additional game types (craps, roulette, hi-lo)
  - Enhanced security mechanisms
  - Gas optimization
  - Formal verification

- **Frontend Enhancements**
  - Mobile responsiveness improvements
  - Additional wallet integrations (WalletConnect)
  - UI/UX improvements
  - Accessibility features
  - Internationalization

- **Backend Infrastructure**
  - Database optimization
  - API performance improvements
  - Monitoring and logging
  - Caching strategies
  - Rate limiting

- **DevOps & Deployment**
  - Docker containerization
  - CI/CD pipeline setup
  - Monitoring and alerting
  - Security hardening

### Before You Start

1. **Check existing issues** - Search for existing discussions
2. **Create an issue** - For major changes, discuss first
3. **Small, focused changes** - One PR per feature/fix
4. **Follow existing patterns** - Maintain code consistency

## Pull Request Process

### 1. Prepare Your Branch

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
git add .
git commit -m "feat: add your feature description"
```

### 2. Run Tests

```bash
# Contract tests
cd contract && cargo test

# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### 3. Submit Pull Request

1. Push your branch to your fork
2. Open a pull request against `main`
3. Fill out the PR template completely
4. Wait for code review

### PR Requirements

- [ ] Tests pass for all affected components
- [ ] Code follows project style guidelines
- [ ] Documentation is updated for new features
- [ ] Commit messages follow conventional commit format
- [ ] No merge conflicts with `main` branch
- [ ] All CI checks pass

## Code Standards

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation change
- `style` - Code style change
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(frontend): add wallet connect modal
fix(contract): handle edge case in reveal function
docs(readme): update installation instructions
```

### Code Style

#### Rust (Smart Contract)
- Use `rustfmt` for formatting
- Follow Rust naming conventions
- Add comprehensive error handling
- Include inline documentation

#### JavaScript (Backend)
- Use ES6+ features
- Follow ESLint configuration
- Use async/await for asynchronous operations
- Include JSDoc comments for functions

#### React (Frontend)
- Use functional components with hooks
- Follow component naming conventions
- Use TypeScript when possible
- Include PropTypes or TypeScript interfaces

### Security Guidelines

1. **Never commit secrets** - Use environment variables
2. **Validate inputs** - All user inputs must be validated
3. **Handle errors** - Never expose sensitive information
4. **Follow principle of least privilege** - Minimal permissions
5. **Security first** - Consider security implications

## Testing

### Test Coverage Requirements

- **Smart Contract**: Minimum 90% line coverage
- **Backend**: Minimum 80% line coverage
- **Frontend**: Minimum 70% line coverage

### Test Types

1. **Unit Tests** - Test individual functions/components
2. **Integration Tests** - Test component interactions
3. **End-to-End Tests** - Test complete user flows
4. **Security Tests** - Test for vulnerabilities

### Running Tests

```bash
# All tests
npm run test:all

# Specific component
npm run test:contract
npm run test:backend
npm run test:frontend

# Test coverage
npm run test:coverage
```

## Documentation

### Documentation Standards

- **README.md** - Project overview and setup
- **API Documentation** - Auto-generated from code comments
- **Code Comments** - Explain complex logic
- **Changelog** - Track version changes

### Updating Documentation

When adding features:
1. Update README.md if needed
2. Add inline code comments
3. Update API documentation
4. Add to CHANGELOG.md

## Getting Help

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Discord** - Real-time community chat

### Issue Reporting

When reporting issues:
1. Use the issue template
2. Provide detailed reproduction steps
3. Include environment details
4. Add relevant logs or screenshots

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes for significant contributions
- Annual contributor appreciation post

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to LumenRoll! Your contributions help make decentralized gaming more accessible and secure.
