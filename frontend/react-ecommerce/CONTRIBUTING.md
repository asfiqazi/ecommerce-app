# Contributing to E-Commerce Frontend

## 🤝 How to Contribute

We welcome contributions to our E-Commerce Frontend project! This guide will help you get started.

### 📋 Prerequisites

- Node.js (v20+)
- npm (v9+) or Yarn
- Git

### 🚀 Getting Started

1. Fork the repository
2. Clone your fork
```bash
git clone https://github.com/your-username/ecommerce-app.git
cd ecommerce-app/frontend/react-ecommerce
```

3. Install dependencies
```bash
npm install
# or
yarn install
```

### 🔧 Development Workflow

#### Running the Project
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

### 🌿 Branch Strategy
- `main`: Stable production code
- `develop`: Active development branch
- `feature/`: New features
- `bugfix/`: Bug fixes
- `hotfix/`: Critical production fixes

### 📝 Commit Guidelines
- Use conventional commits
- Format: `<type>(scope): description`
- Types: 
  - `feat`: New feature
  - `fix`: Bug fix
  - `docs`: Documentation changes
  - `style`: Code formatting
  - `refactor`: Code refactoring
  - `test`: Adding or updating tests
  - `chore`: Maintenance tasks

Example:
```
feat(auth): add password reset functionality
fix(cart): resolve item quantity update bug
```

### 🧪 Testing
- Write unit tests for new features
- Ensure 70%+ test coverage
- Run tests before submitting PR

### 🔍 Code Review Process
1. Open a pull request
2. Describe changes in the PR description
3. Ensure all CI checks pass
4. Wait for review from maintainers

### 🛠 Code Style
- Follow ESLint and Prettier configurations
- Use TypeScript with strict mode
- Write clear, concise comments
- Keep functions small and focused

### 🔒 Security
- Never commit sensitive information
- Use environment variables
- Report security issues privately

### 📊 Performance
- Optimize imports
- Use lazy loading
- Minimize bundle size
- Follow React best practices

### 💡 Suggestions
- Open an issue to discuss major changes
- Be respectful and collaborative
- Help improve documentation

## 🏆 Contributors Guide
- Star the repository
- Share the project
- Spread the word!

### 📄 License
This project is licensed under the MIT License.
