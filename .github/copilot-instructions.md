# GitHub Copilot Instructions for AstroCalc Project

## Project Context
This is a React Native mobile application built with Expo for astrology calculations and interpretations.

## Tech Stack
- **Framework:** React Native 0.81.4 + Expo 54
- **Routing:** Expo Router 6.0
- **Backend:** Supabase (PostgreSQL)
- **AI Integration:** n8n webhooks
- **Icons:** lucide-react-native (limited), emoji fallbacks
- **Styling:** StyleSheet with LinearGradient
- **State:** React hooks + AsyncStorage

## Code Style Guidelines

### TypeScript
- Use strict typing
- Prefer interfaces over types for objects
- Use explicit return types for functions

### React Native
- Use functional components with hooks
- Avoid class components
- Use React.memo for performance optimization
- Prefer const over let

### Styling
- Use StyleSheet.create for all styles
- Keep styles at bottom of file
- Use consistent color palette from existing code
- Maintain spacing consistency (padding: 20, gap: 12, etc.)

### File Naming
- Components: PascalCase (e.g., `ProfileScreen.tsx`)
- Utilities: camelCase (e.g., `validation.ts`)
- Services: camelCase (e.g., `webhook.ts`)
- Types: PascalCase in `types/` directory

## Icon Usage
**IMPORTANT:** lucide-react-native has limited icons. Use these alternatives:

### Available Icons
✅ User, Star, Calendar, ArrowLeft, Circle, Sun, Moon, TrendingUp, Plus, RefreshCw, Clock, ChevronLeft, ChevronRight, Heart, Filter, Trash2, Bot, Send, Sparkles

### NOT Available (Use Emoji)
❌ Mail → 📧, MapPin → 📍, Save → ✔️, Phone → 📞, CreditCard → 💳, Lock → 🔒

## Supabase Integration

### Tables
- `user_profiles`: User information
- `birth_chart_data`: Birth chart calculations
- `natal_charts`: Detailed chart data
- `astrology_interpretations`: AI interpretations

### Authentication
- Use `useAuth` hook from `hooks/useAuth.ts`
- Always check `supabase` availability (can be null)
- Implement demo mode fallbacks

## Common Patterns

### Loading States
```typescript
const [loading, setLoading] = useState(false);
const [data, setData] = useState<Type | null>(null);
```

### Error Handling
```typescript
try {
  // operation
} catch (error) {
  console.error('Context:', error);
  Alert.alert('Hata', 'User-friendly message');
}
```

### Async Operations
```typescript
const handleAction = async () => {
  setLoading(true);
  try {
    const result = await service.action();
    if (result.error) {
      // handle error
    }
  } catch (error) {
    // handle exception
  } finally {
    setLoading(false);
  }
};
```

## MCP Usage Preferences

### When to use Filesystem MCP
- Batch file operations
- Project structure analysis
- Refactoring multiple files
- Asset management

### When to use GitHub MCP
- Creating issues
- Reviewing commits
- Managing branches
- Checking repository status

### When to use PostgreSQL MCP
- Schema analysis
- Query optimization
- Data migrations
- Testing database operations

## Feature Development Guidelines

1. **Plan First:** Use Sequential Thinking MCP for complex features
2. **Check Docs:** Use Context7 MCP for library documentation
3. **Test Code:** Use Code Runner MCP for utility functions
4. **Optimize Queries:** Use PostgreSQL MCP for database operations
5. **Commit Smart:** Use GitHub MCP for repository operations

## Astrology Domain Knowledge

### Zodiac Signs (Turkish)
Koç, Boğa, İkizler, Yengeç, Aslan, Başak, Terazi, Akrep, Yay, Oğlak, Kova, Balık

### Calculation Context
- Birth dates must be in DD-MM-YYYY format
- Times in 24-hour format (HH:MM)
- Location includes city and country
- Timezone conversions are critical

## Performance Considerations

- Use React.memo for expensive components
- Implement FlatList for long lists (avoid ScrollView)
- Lazy load images and assets
- Cache API responses in AsyncStorage
- Minimize re-renders with useMemo/useCallback

## Accessibility

- Use accessible labels for buttons
- Provide alternative text for images
- Ensure sufficient color contrast
- Support screen readers
- Test with VoiceOver/TalkBack

## Testing Approach

- Write unit tests for utilities
- Test API integrations with mock data
- Validate form inputs thoroughly
- Test edge cases for date/time calculations
- Check offline functionality

## Localization

- All user-facing text in Turkish
- Format dates with Turkish locale
- Use Turkish naming conventions
- Provide Turkish error messages

## Security

- Never commit `.env` or `.env.local`
- Validate all user inputs
- Sanitize data before database queries
- Use Supabase RLS policies
- Implement rate limiting for webhooks

## When Making Changes

1. ✅ Check existing patterns first
2. ✅ Maintain consistency with current code
3. ✅ Update types if data structures change
4. ✅ Test on both iOS and Android mentally
5. ✅ Consider offline scenarios
6. ✅ Add console logs for debugging
7. ✅ Handle loading and error states
8. ✅ Provide user feedback (Alert, Toast, etc.)

## Priority Order for Problem Solving

1. 🔍 Search existing codebase for similar patterns
2. 📚 Check Context7 for library documentation
3. 🧪 Test solution with Code Runner
4. 💾 Verify database schema with PostgreSQL MCP
5. 🔄 Commit changes with GitHub MCP

---

**Remember:** This is a production app with real users. Prioritize stability, user experience, and data integrity.
