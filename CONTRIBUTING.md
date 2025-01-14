# Contributing to E-Commerce App

## Welcome Contributors! 🚀

We're thrilled that you're interested in contributing to our E-Commerce App. This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

## How Can You Contribute?

There are many ways to contribute to our project:

1. **Reporting Bugs**
2. **Suggesting Enhancements**
3. **Code Contributions**
4. **Documentation Improvements**
5. **Testing**

### Reporting Bugs 🐞

- Use the GitHub Issues section
- Check existing issues to avoid duplicates
- Provide a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Include system details (OS, browser, etc.)
- Add screenshots or error logs if possible

### Suggesting Enhancements 💡

- Use GitHub Issues to propose new features
- Clearly describe the proposed enhancement
- Provide context and potential implementation details
- Discuss the value and potential impact

## Development Setup

### Prerequisites

- Node.js (v16+)
- npm (v8+)
- Python (v3.9+)
- Docker (optional, for containerization)

### Local Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/[asfiqazi]/ecommerce-app.git
   cd ecommerce-app
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Backend Setup**
   ```bash
   cd ../backend
   npm install
   npm run start:dev
   ```

## Contribution Workflow

1. **Fork the Repository**
2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow the project's coding standards
   - Write clear, concise commit messages
   - Include tests for new features

4. **Run Tests**
   ```bash
   # Frontend tests
   npm test

   # Backend tests
   npm run test
   ```

5. **Submit a Pull Request**
   - Provide a clear description of changes
   - Link any related issues
   - Ensure all checks pass

## Code Style and Standards

### Frontend (React)
- Use ESLint
- Follow Airbnb React/JSX Style Guide
- Use Prettier for code formatting

### Backend (NestJS)
- Follow NestJS best practices
- Use ESLint for code linting
- Write comprehensive unit and integration tests
- Use TypeScript strict mode
- Follow SOLID principles

## Performance and Security

- Optimize database queries
- Implement proper error handling
- Follow security best practices
- Use environment variables for sensitive information

## Review Process

- All contributions are reviewed by maintainers
- Expect feedback and potential requested changes
- Be patient and open to constructive criticism

## Communication Channels

- GitHub Issues

## Recognition

Contributors will be recognized in the project's README and release notes.

## License

By contributing, you agree that your contributions will be licensed under the project's [LICENSE](LICENSE).

---

Thank you for your interest in improving our E-Commerce App! 🎉
