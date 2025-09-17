## 🎯 Description
Brief description of what this PR accomplishes.

**Related Issue**: Closes #[issue_number]

## 🔄 Type of Change
- [ ] 🐛 **Bug fix** (non-breaking change which fixes an issue)
- [ ] ✨ **New feature** (non-breaking change which adds functionality)
- [ ] 💥 **Breaking change** (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 **Documentation update**
- [ ] 🧹 **Code refactoring** (no functional changes)
- [ ] 🧪 **Test improvements**
- [ ] ⬆️ **Dependency updates**

## 🔮 Astrology Features Affected
- [ ] **Birth Chart Calculations** (planetary positions, aspects)
- [ ] **Daily Horoscope Generation** (caching, AI generation)
- [ ] **AI Chat** (webhook integration, message handling)
- [ ] **User Authentication** (registration, login, profile)
- [ ] **Data Storage** (Supabase integration, migrations)
- [ ] **UI/UX Components** (forms, navigation, styling)
- [ ] **Notifications** (push notifications, scheduling)
- [ ] **Performance** (caching, optimization)

## 🧪 Testing Checklist
### Functional Testing
- [ ] Feature works as expected
- [ ] Edge cases handled properly
- [ ] Error scenarios tested
- [ ] User input validation working

### Platform Testing
- [ ] **iOS Device/Simulator** tested
- [ ] **Android Device/Emulator** tested
- [ ] **Expo Go** compatibility verified
- [ ] **Web version** tested (if applicable)

### Astrology Data Testing
- [ ] Tested with different birth dates/times
- [ ] Tested with various locations (timezone handling)
- [ ] Verified astrological calculations accuracy
- [ ] Tested edge cases (leap years, DST changes)

### Backend Integration
- [ ] Supabase queries working correctly
- [ ] Webhook endpoints responding properly
- [ ] Data validation on server side
- [ ] Error handling for network issues

## 📱 Device Testing Matrix
| Device Type | iOS | Android | Status |
|-------------|-----|---------|--------|
| Phone       | [ ] | [ ]     | ✅/❌   |
| Tablet      | [ ] | [ ]     | ✅/❌   |
| Expo Go     | [ ] | [ ]     | ✅/❌   |

## 🔒 Security Considerations
- [ ] No sensitive data exposed in logs
- [ ] API keys properly secured
- [ ] User data handled according to privacy policy
- [ ] Input sanitization implemented

## 📊 Performance Impact
- [ ] No performance degradation detected
- [ ] Memory usage within acceptable limits
- [ ] App startup time not affected
- [ ] Network requests optimized

## 📋 Code Quality Checklist
- [ ] Code follows project style guidelines
- [ ] TypeScript types properly defined
- [ ] ESLint checks pass
- [ ] Self-review completed
- [ ] Code is properly commented
- [ ] No console.logs left in production code

## 📷 Screenshots/GIFs
<!-- Add screenshots or GIFs showing the changes -->

## 🔍 Testing Instructions
### For Reviewers:
1. Checkout this branch
2. Run `npm install` 
3. Start the app with `npm run dev`
4. Test the following scenarios:
   - [ ] Scenario 1: ...
   - [ ] Scenario 2: ...
   - [ ] Scenario 3: ...

### Specific Test Cases:
```bash
# Commands to test specific functionality
npm run test
npx expo export --platform all
```

## 📝 Additional Notes
<!-- Any additional information that reviewers should know -->

## 🎯 Post-Merge Tasks
- [ ] Update documentation if needed
- [ ] Notify stakeholders of changes
- [ ] Monitor for any issues in production
- [ ] Update related issues/tickets
