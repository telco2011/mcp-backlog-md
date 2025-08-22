# 🔒 Security Policy

We take the security of the MCP Backlog.md Server seriously. This document outlines our security policies, practices, and procedures for reporting vulnerabilities.

## 🛡️ Security Overview

The MCP Backlog.md Server implements multiple layers of security to protect against common vulnerabilities:

### ✅ **Implemented Security Measures**

#### **Input Validation & Sanitization**

- **Zod Schema Validation**: All tool parameters are validated using strict Zod schemas
- **Input Sanitization**: User inputs are sanitized to prevent command injection attacks
- **Parameter Whitelisting**: Only expected parameters are accepted and processed

#### **Secure Command Execution**

- **execFile Over exec**: Uses `execFile` when possible to prevent shell injection
- **Command Sanitization**: Arguments are sanitized before shell execution
- **Path Validation**: File paths are validated to prevent directory traversal attacks
- **Retry Logic**: Exponential backoff prevents resource exhaustion attacks

#### **Error Handling**

- **Information Disclosure Prevention**: Error messages don't expose sensitive system information
- **Structured Error Handling**: Custom error classes provide context without security risks
- **Logging Safety**: Sensitive data is never logged to console or files

#### **Dependency Security**

- **Automated Vulnerability Scanning**: Regular `npm audit` checks in CI/CD pipeline
- **Dependency Updates**: Automated dependency updates for security patches
- **Supply Chain Security**: Lockfile integrity verification

## 🔍 Supported Versions

We provide security updates for the following versions:

| Version | Supported         |
| ------- | ----------------- |
| 1.2.x   | ✅ **Current**    |
| 1.1.x   | ✅ Security fixes |
| 1.0.x   | ❌ End of life    |
| < 1.0   | ❌ Not supported  |

## 🚨 Reporting Security Vulnerabilities

### **How to Report**

**For security vulnerabilities, please DO NOT create public GitHub issues.**

Instead, please report security issues responsibly:

1. **Email**: Send details to `security@your-domain.com` (replace with actual email)
2. **Subject**: `[SECURITY] MCP Backlog.md Server - Brief Description`
3. **Encryption**: Use our PGP key if possible (key ID: `YOUR_PGP_KEY_ID`)

### **What to Include**

Please include the following information:

#### **Vulnerability Details**

- **Type of issue**: Command injection, path traversal, etc.
- **Affected component**: Specific tool or library module
- **Impact assessment**: What could an attacker achieve?
- **Affected versions**: Which versions are vulnerable?

#### **Reproduction Information**

- **Steps to reproduce**: Clear, step-by-step instructions
- **Proof of concept**: Code or commands that demonstrate the issue
- **Environment details**: Node.js version, OS, MCP client used
- **Screenshots/logs**: If applicable and non-sensitive

#### **Suggested Fix** _(Optional)_

- **Proposed solution**: How you think it should be fixed
- **Code suggestions**: Specific code changes if you have them

### **Response Timeline**

We aim to respond to security reports according to this timeline:

- **Initial Response**: Within 48 hours
- **Vulnerability Assessment**: Within 1 week
- **Fix Development**: Within 2-4 weeks (depending on severity)
- **Security Advisory**: Published with fix release
- **Credits**: Public acknowledgment (if desired)

### **Disclosure Policy**

We follow **responsible disclosure** principles:

1. **Private reporting** of vulnerabilities
2. **Coordinated disclosure** timeline
3. **Public disclosure** only after fixes are available
4. **Credit** to researchers who report responsibly

## 🔐 Security Best Practices for Users

### **Installation Security**

```bash
# Use specific versions to avoid supply chain attacks
npm install mcp-backlog-md@1.2.1

# Verify package integrity
npm ls mcp-backlog-md

# Regular updates for security patches
npm update mcp-backlog-md
```

### **Configuration Security**

#### **Project Path Validation**

```json
{
  "projectPath": "/absolute/path/to/project"
}
```

- ✅ **Use absolute paths** to prevent path traversal
- ✅ **Validate project structure** before operations
- ❌ **Avoid relative paths** like `../../../etc/passwd`

#### **Parameter Sanitization**

```json
{
  "title": "Clean task title",
  "description": "Safe description without shell metacharacters"
}
```

- ✅ **Alphanumeric characters** are safest
- ✅ **Spaces and basic punctuation** are handled safely
- ❌ **Avoid shell metacharacters**: `;`, `|`, `&`, `$`, `` ` ``, `(`, `)`

### **Environment Security**

#### **File System Permissions**

```bash
# Restrict permissions on project directories
chmod 755 /path/to/backlog/project
chmod 644 /path/to/backlog/project/config.yml
```

#### **Network Security**

- **Firewall rules**: Limit access to MCP server ports
- **VPN usage**: Consider VPN for remote MCP connections
- **TLS encryption**: Use encrypted connections when possible

## 🛠️ Security for Developers

### **Secure Development Guidelines**

#### **Input Validation**

```typescript
// ✅ Always validate with Zod schemas
const schema = z.object({
  taskId: z.string().regex(/^[a-zA-Z0-9-_]+$/, 'Invalid task ID format'),
  title: z.string().max(200, 'Title too long'),
});

// ✅ Sanitize before use
const sanitizedInput = sanitizeInput(userInput);
```

#### **Command Construction**

```typescript
// ✅ Safe command building
const command = `${backlogCommand} task create "${sanitizeArgument(title)}"`;

// ❌ Unsafe direct concatenation
const unsafeCommand = `${backlogCommand} task create ${title}`;
```

#### **Error Handling**

```typescript
// ✅ Safe error messages
throw new CliError(`Task operation failed: ${sanitizedError}`);

// ❌ Information disclosure
throw new Error(`Database password: ${dbPassword} - Connection failed`);
```

### **Security Testing**

#### **Static Analysis**

```bash
npm run lint          # ESLint security rules
npm audit             # Dependency vulnerabilities
npm run typecheck     # Type safety verification
```

#### **Dynamic Testing**

```bash
# Test with malicious inputs
npm run test -- --grep="security"

# Integration testing with edge cases
npm run inspector     # Manual security testing
```

### **Dependency Management**

#### **Vulnerability Scanning**

```bash
# Regular vulnerability checks
npm audit --audit-level moderate

# Automated fixes (review carefully)
npm audit fix

# Manual review of changes
git diff package-lock.json
```

#### **Supply Chain Security**

```bash
# Verify package integrity
npm ls --depth=0

# Check for unexpected dependencies
npm ls --depth=1 | grep -E "(bin|scripts)"
```

## ⚡ Incident Response

### **If You Discover a Vulnerability**

#### **Immediate Actions**

1. **Document** the vulnerability with screenshots/logs
2. **Isolate** affected systems if possible
3. **Report** following our responsible disclosure process
4. **Do not** exploit or share the vulnerability publicly

#### **For Critical Vulnerabilities**

- **Contact us immediately** via email
- **Include "URGENT"** in the subject line
- **Provide detailed impact assessment**

### **Security Incident Response Process**

1. **Triage** (0-24 hours)
   - Assess severity and impact
   - Assign response team
   - Begin preliminary investigation

2. **Investigation** (1-7 days)
   - Root cause analysis
   - Scope determination
   - Affected version identification

3. **Mitigation** (7-30 days)
   - Develop and test fixes
   - Prepare security advisory
   - Coordinate disclosure timeline

4. **Resolution** (30+ days)
   - Release security updates
   - Publish security advisory
   - Monitor for additional issues

## 🏆 Security Hall of Fame

We recognize security researchers who help make our project safer:

### **Responsible Disclosure Contributors**

_No vulnerabilities reported yet - be the first to help us improve security!_

### **Security Improvement Contributors**

- **[Your Name Here]** - Security enhancements in v1.2.0
- **[Community Member]** - Vulnerability assessment and testing

## 📚 Additional Security Resources

### **Security Guidelines**

- [OWASP Node.js Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [npm Security Best Practices](https://docs.npmjs.com/security)
- [Node.js Security Working Group](https://github.com/nodejs/security-wg)

### **Tools and Scanners**

- **Static Analysis**: ESLint security plugin, Semgrep
- **Dependency Scanning**: npm audit, Snyk, WhiteSource
- **Dynamic Testing**: OWASP ZAP, Burp Suite Community

### **Stay Updated**

- **GitHub Security Advisories**: Watch this repository for security updates
- **npm Security Bulletins**: Follow [@npmjs](https://twitter.com/npmjs) for security news
- **Node.js Security**: Subscribe to [Node.js security updates](https://nodejs.org/en/security/)

## ⚖️ Security Policy Updates

This security policy may be updated periodically. Major changes will be announced via:

- **GitHub Security Advisory**: For policy changes affecting security
- **Release Notes**: For minor clarifications and improvements
- **Project Discussions**: For community input on policy changes

**Last Updated**: Current date
**Version**: 1.0

---

<div align="center">
<h3>🔐 Security is a shared responsibility</h3>
<p>Thank you for helping keep the MCP Backlog.md Server and our community safe!</p>
</div>
