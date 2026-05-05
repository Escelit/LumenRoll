# Changelog

All notable changes to LumenRoll will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Real blockchain integration (in progress)
- Complete backend API infrastructure
- Security policy and documentation

### Changed
- Enhanced UI/UX design
- Improved responsive layout

## [1.0.0] - 2025-05-05

### Added
- **Smart Contract**: Complete Soroban dice game implementation
  - Provably fair commit-reveal randomness scheme
  - Game state management (place_bet, house_commit, reveal, claim_expired)
  - Error handling and validation
  - 5x payout multiplier with house edge

- **Backend API**: Complete Node.js server implementation
  - Express server with CORS and middleware
  - Betting API routes (`/api/bet/*`)
  - House automation routes (`/api/house/*`)
  - Stellar SDK integration for blockchain operations
  - Contract interaction helpers
  - Secure randomness service with AES-256 encryption
  - Environment configuration templates

- **Frontend**: Modern React application
  - Responsive design with Tailwind CSS
  - Interactive dice selection and betting controls
  - Real-time game animations and transitions
  - Wallet connection interface (mock implementation)
  - Game history and statistics tracking
  - Dark theme with gradient effects
  - Mobile-optimized layout

- **Documentation**: Comprehensive project documentation
  - Detailed README with setup instructions
  - API documentation and examples
  - Security best practices and threat model
  - Contributing guidelines and code of conduct
  - Deployment checklist and requirements

- **Development**: Complete development environment
  - Database schema for PostgreSQL
  - Build scripts and deployment helpers
  - Environment configuration templates
  - Testing framework setup
  - Docker containerization support

### Security
- Implemented dual commit-reveal randomness scheme
- AES-256 encrypted secret storage
- Input validation and sanitization
- Rate limiting and DoS protection
- Secure headers and CORS configuration
- Environment variable management
- Smart contract audit preparation

### Performance
- Optimized smart contract gas usage
- Efficient database queries
- Frontend code splitting and lazy loading
- API response caching
- Compressed assets and minification

### Breaking Changes
- None

### Deprecated
- None

### Removed
- None

### Fixed
- None

## [0.9.0] - 2025-04-28

### Added
- Initial smart contract development
- Basic frontend prototype
- Project repository setup

### Changed
- None

### Fixed
- None

## [0.8.0] - 2025-04-21

### Added
- Project concept and design
- Architecture planning
- Technology stack selection

---

## Version History Summary

| Version | Release Date | Status | Key Features |
|----------|---------------|----------|--------------|
| 1.0.0 | 2025-05-05 | ✅ Complete dice game with provably fair system |
| 0.9.0 | 2025-04-28 | 🚧 Smart contract and frontend prototype |
| 0.8.0 | 2025-04-21 | 📋 Project planning and architecture |

## Upgrade Guide

### From 0.9.0 to 1.0.0

No breaking changes. Simply pull the latest changes:

```bash
git pull origin main
npm install  # Update dependencies
npm run migrate  # Update database if needed
```

### Environment Variables

New environment variables added in 1.0.0:

```bash
# Backend
SECRET_STORE_ENCRYPTION_KEY=your-32-byte-hex-key-here

# Frontend  
VITE_API_URL=http://localhost:3001
VITE_CONTRACT_ID=C...
```

## Migration Notes

### Database Migration

Version 1.0.0 includes database schema updates:

```sql
-- Run existing migration
npm run migrate

-- New tables will be created automatically
```

### Smart Contract Migration

If upgrading from testnet to mainnet:

1. Update contract deployment scripts
2. Deploy new contract to mainnet
3. Update environment variables
4. Migrate any existing data

## Security Updates

### Version 1.0.0 Security Enhancements

- **Enhanced Randomness**: Improved commit-reveal scheme validation
- **Better Encryption**: AES-256 for all secret storage
- **Input Validation**: Comprehensive validation for all API endpoints
- **Rate Limiting**: Protection against DoS and brute force attacks
- **Secure Headers**: Added security-focused HTTP headers
- **Environment Security**: Better secret management practices

### Known Vulnerabilities

None reported in version 1.0.0.

## Roadmap

### Upcoming Features (1.1.0)

- **Real Blockchain Integration**: Complete frontend-blockchain connection
- **Multiple Wallet Support**: WalletConnect and additional wallets
- **Enhanced Game Types**: Craps, roulette, hi-lo games
- **Mobile App**: React Native implementation
- **Advanced Analytics**: Real-time statistics and insights

### Future Plans (2.0.0)

- **Multi-token Support**: Support for various Stellar assets
- **Tournament System**: Competitive gameplay modes
- **Staking Rewards**: LumenRoll token staking
- **Governance**: DAO-based decision making
- **Cross-chain**: Support for other blockchains

## Contributing to Changelog

When contributing to LumenRoll:

1. Add entries under the "Unreleased" section
2. Follow the established format
3. Include version number and release date
4. Document breaking changes clearly
5. Link to relevant issues or pull requests

### Entry Format

```markdown
### Added
- New feature description ([#123](link-to-issue))

### Changed
- Modified existing feature ([#456](link-to-issue))

### Fixed
- Bug fix description ([#789](link-to-issue))

### Security
- Security improvement description
```

---

For more details about the changes, please refer to the [GitHub releases page](https://github.com/Escelit/LumenRoll/releases).
