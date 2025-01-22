# AI-Assisted Development Guide

## Working with Cursor AI and AI Assistants

### Getting Started

1. **Project Context**
   - Always provide the AI with context about the current file/task
   - Reference specific issue numbers (#) when asking questions
   - Share relevant code snippets when asking for help

2. **Effective Prompting**
   - Be specific about what you need
   - Include error messages if you have them
   - Specify the desired output format
   - Reference project standards defined in issue #13

### Common Prompt Templates

#### Implementing New Features
```
I'm working on issue #[NUMBER]. I need to implement [FEATURE].
Current file: [FILE_PATH]
Project context: [BRIEF DESCRIPTION]

Specific questions:
1. [QUESTION]
2. [QUESTION]
```

#### Debugging Issues
```
I'm getting this error:
[ERROR_MESSAGE]

File: [FILE_PATH]
Related issue: #[NUMBER]

What I've tried:
1. [ATTEMPT]
2. [ATTEMPT]
```

#### Code Review Requests
```
Can you review this code for:
- Adherence to project standards (#13)
- Potential security issues
- Performance concerns
- Error handling

[CODE_SNIPPET]
```

### Best Practices

1. **Breaking Down Tasks**
   - Start with small, focused changes
   - Follow the development sequence in #15
   - Complete one component before moving to the next
   - Write tests for each component

2. **Using Cursor AI Features**
   - Use `/` commands for quick actions
   - Utilize inline code suggestions
   - Ask for explanations of complex code
   - Request step-by-step implementations

3. **Code Organization**
   - Follow the project structure in #13
   - Use .mjs extension for all files
   - Implement centralized error handling
   - Follow the defined logging standards

### Common Development Scenarios

#### Creating New Routes
```
I need to create a new route for [FEATURE].
It should:
1. Follow the pattern in routes/index.mjs
2. Include proper validation
3. Use centralized error handling
4. Include appropriate logging
```

#### Implementing Services
```
I need to implement [SERVICE_NAME] service.
Requirements:
1. Follow service pattern in #13
2. Include error handling
3. Add proper logging
4. Include unit tests
```

#### Database Operations
```
I need to:
1. Create/modify [MODEL_NAME] schema
2. Implement [OPERATION] operation
3. Ensure proper indexing
4. Include data validation
```

### Troubleshooting Tips

1. **When You're Stuck**
   - Share the full context
   - Include relevant code
   - Explain what you've tried
   - Reference similar issues/code

2. **Common Issues**
   - Module import problems
   - Authentication flow issues
   - Database connection errors
   - Type errors in TypeScript

### Quality Checklist

Before committing code, ensure:
- [ ] Follows project structure (#13)
- [ ] Includes proper error handling
- [ ] Has appropriate logging
- [ ] Includes tests
- [ ] Follows naming conventions
- [ ] Has necessary documentation

### AI Assistant Instructions

The AI assistant should:
1. Always reference relevant issues
2. Provide complete, working code examples
3. Explain complex concepts
4. Suggest best practices
5. Point out potential issues
6. Include error handling
7. Add appropriate comments

### File Organization

```
/src
  /config         # Use index.mjs for exports
  /routes         # Use index.mjs for route management
  /services       # Business logic
  /models         # Database models
  /middleware     # Express middleware
  /utils          # Utility functions
  /tests         # Test files
```

### Development Tools

1. **VS Code Extensions**
   - ESLint
   - Prettier
   - Git Lens
   - Jest Runner

2. **Cursor AI Commands**
   - `/fix` - Fix code issues
   - `/explain` - Explain code
   - `/test` - Generate tests
   - `/doc` - Generate documentation

### Example Workflow

1. Start new feature:
   ```bash
   git checkout -b feature/[ISSUE-NUMBER]-description
   ```

2. Implement feature following #13 standards

3. Write tests:
   ```bash
   npm run test
   ```

4. Check quality:
   ```bash
   npm run lint
   npm run format
   ```

5. Commit:
   ```bash
   git commit -m "[#ISSUE-NUMBER] Description"
   ```

### Getting Help

1. First, check:
   - Issue #13 for standards
   - Issue #15 for development sequence
   - Similar implemented features
   - Existing utils/helpers

2. When asking for help:
   - Reference specific issues
   - Include relevant code
   - Explain what you've tried
   - Share error messages

Remember: The AI assistant is a tool to help you write better code, not a replacement for understanding the code you're writing.