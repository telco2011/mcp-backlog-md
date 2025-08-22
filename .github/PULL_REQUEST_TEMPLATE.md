# 🔄 Pull Request

## 📝 Description

<!-- Provide a clear and concise description of the changes in this PR -->

### 🎯 Type of Change

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Code refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test coverage improvement
- [ ] 🔒 Security enhancement

### 🔗 Related Issues

<!-- Link to related issues using "Fixes #123" or "Closes #123" -->

- Fixes #
- Related to #

## 🧪 Testing

### ✅ Testing Checklist

- [ ] All existing tests pass (`npm run test`)
- [ ] New tests added for new functionality
- [ ] Test coverage maintained (>70%)
- [ ] Manual testing completed with MCP inspector
- [ ] Integration testing performed

### 🔍 Test Instructions

<!-- Provide specific instructions for testing the changes -->

1. **Setup:**

   ```bash
   npm install
   npm run build
   ```

2. **Test the changes:**

   ```bash
   # Add specific test commands or MCP inspector steps
   ```

3. **Expected behavior:**
   <!-- Describe what should happen -->

## 📋 Quality Checklist

### 🔧 Code Quality

- [ ] Code follows project style guidelines (`npm run lint`)
- [ ] Code is properly formatted (`npm run format`)
- [ ] TypeScript types are correct (`npm run typecheck`)
- [ ] All quality checks pass (`npm run check-all`)
- [ ] No console.log statements in production code
- [ ] Proper error handling implemented

### 🔒 Security Checklist

- [ ] Input validation implemented with Zod schemas
- [ ] User inputs are sanitized before command execution
- [ ] No direct shell command concatenation with user input
- [ ] File path validation prevents directory traversal
- [ ] Error messages don't expose sensitive information
- [ ] No hardcoded credentials or secrets

### 📚 Documentation

- [ ] Code is self-documenting with clear variable/function names
- [ ] Complex logic includes explanatory comments
- [ ] API documentation updated if applicable ([API.md](../docs/API.md))
- [ ] Usage examples added if needed ([EXAMPLES.md](../docs/EXAMPLES.md))
- [ ] Developer guide updated for new features ([DEVELOPER_GUIDE.md](../DEVELOPER_GUIDE.md))

## 🏗️ Architecture & Design

### 🎯 Design Decisions

<!-- Explain any significant design decisions made -->

### 🔄 Breaking Changes

<!-- List any breaking changes and migration instructions -->

- [ ] No breaking changes
- [ ] Breaking changes documented with migration guide

### ⚡ Performance Impact

<!-- Describe any performance implications -->

- [ ] No performance impact
- [ ] Performance improvements included
- [ ] Performance impact documented and justified

## 📸 Screenshots (if applicable)

<!-- Add screenshots for UI changes or MCP inspector output -->

## 🔍 Review Guidelines

### 🎯 Focus Areas for Reviewers

Please pay special attention to:

- [ ] Security implications of the changes
- [ ] Test coverage and quality
- [ ] Code maintainability and readability
- [ ] Adherence to project conventions
- [ ] Documentation completeness

### ❓ Questions for Reviewers

<!-- Any specific questions or areas where you'd like reviewer feedback -->

## 📝 Additional Notes

<!-- Any additional information that would help reviewers -->

### 🔄 Before Merging

- [ ] All CI/CD checks pass
- [ ] At least one code review approval
- [ ] Security review completed (if applicable)
- [ ] Documentation review completed
- [ ] Manual testing verification completed

---

## 📚 Helpful Links

- [🚀 Developer Guide](../DEVELOPER_GUIDE.md)
- [🤝 Contributing Guidelines](../CONTRIBUTING.md)
- [📚 API Documentation](../docs/API.md)
- [🔒 Security Policy](../SECURITY.md)

<!--
Thank you for contributing to MCP Backlog.md Server! 🎉
Your contributions help make this project better for the entire community.
-->
