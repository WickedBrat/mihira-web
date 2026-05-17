# Graph Report - .  (2026-05-13)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 877 nodes · 1997 edges · 56 communities (51 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `27cf6851`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 43|Community 43]]

## God Nodes (most connected - your core abstractions)
1. `Text` - 70 edges
2. `useTheme()` - 52 edges
3. `ConstellationLoader()` - 25 edges
4. `OnboardingData` - 24 edges
5. `FocusAreaCard()` - 21 edges
6. `useProfile()` - 21 edges
7. `Screen1()` - 19 edges
8. `useNaradState()` - 19 edges
9. `ToastProvider()` - 18 edges
10. `SacredButton()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `handleChatRequest()`  [EXTRACTED]
  web/app/v1/api/ask/route.ts → mobile/lib/server/routes/chat.ts
- `POST()` --calls--> `handleAskRequest()`  [EXTRACTED]
  web/app/v1/api/ask/route.ts → mobile/lib/server/routes/ask.ts
- `POST()` --calls--> `handleMuhuratWisdomRequest()`  [EXTRACTED]
  web/app/v1/api/ask/route.ts → mobile/lib/server/routes/muhurat.ts
- `POST()` --calls--> `handleDailyWisdomRequest()`  [EXTRACTED]
  web/app/v1/api/ask/route.ts → mobile/lib/server/routes/daily.ts
- `POST()` --calls--> `handleDailyArthReflectionRequest()`  [EXTRACTED]
  web/app/v1/api/ask/route.ts → mobile/lib/server/routes/dailyArthReflection.ts

## Communities (56 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (71): CompareTextsView(), EmptyAskState(), TOPIC_CARDS, FollowUpActions(), SavedPassageButton(), AppleLogoIconProps, OAuthButton(), OAuthButtonProps (+63 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (34): ChatInput(), ChatInputProps, getParamValue(), parseInitialReflection(), ReflectionSection(), getCalendarImageUri(), DailyArthCard(), LessonCard() (+26 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (25): parsed, perplexityChat(), perplexityStream(), buildDailyPrompt(), buildMuhuratPrompt(), GUIDE_SYSTEM_PROMPTS, mockPerplexityChat, POST() (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (35): lahiriAyanamsha(), parseBirthDt(), toJDE(), toSidereal(), buildBirthChart(), getNakshatra(), NAKSHATRAS, getCurrentDasha() (+27 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (31): charmonman, downloadBadges, faqs, flowSteps, hasAppStoreUrl, hasGooglePlayUrl, HomePage(), inquiries (+23 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (30): Message, NaradContext, NaradHistoryEntry, NaradResponse, ShlokaData, NARAD_WELCOME, useNaradState(), ChatBubble() (+22 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (29): NaradIntro(), TRUST_PILLARS, useAskState(), useSubscription(), useUsage(), MuhuratRequest, MuhuratState, useMuhurat() (+21 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (22): GuideLoader(), GuideLoaderProps, MergePulseProps, ORB_STARTS, OrbProps, { width: SCREEN_W, height: SCREEN_H }, getGuide(), GuidePersona (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (22): DailyAlignmentCard(), DailyPredictionGender, getDailyPredictionImage(), IMAGE_BY_AREA, normalizeDailyPredictionGender(), buildTodayDate(), FocusAreaCard(), getFocusAreaWindow() (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (21): AskChatItem, AskContextV2, AskHistoryTurn, AskSavedPassage, clearAskConversation(), clearAskHistory(), clearAskMessages(), clearAskState() (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (19): SafetyRule, AnimationTrigger, AskAssistantMessage, AskSafetyBoundary, AskSafetyEscalationType, AskTopic, AskUserMessage, BubbleType (+11 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (19): getPaywallResult(), getRevenueCatApiKey(), getRevenueCatEntitlementId(), getRevenueCatOfferingId(), getRevenueCatUiUnavailableMessage(), hasActiveEntitlement(), hasRevenueCatNativeUiModules(), isExpoGo() (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (16): AnalyticsIdentity(), display, googleSans, GuardedNavigation(), ThemedAppShell(), ThemedStack(), viewport, PaymentSuccessPage() (+8 more)

### Community 13 - "Community 13"
Cohesion: 0.12
Nodes (17): ClearChatSheet(), ClearChatSheetProps, ProfileAuthSheet(), ProfileAuthSheetProps, BG_IMAGES, TimeOfDayCard(), spy, ThemeContextValue (+9 more)

### Community 14 - "Community 14"
Cohesion: 0.16
Nodes (17): buildCitationLabel(), corpus, editorialConfidenceToResponseConfidence(), getScriptureCorpus(), RankedPassage, toScriptureSource(), withCitation(), AskClassification (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.17
Nodes (14): ProfileHero(), useGuide(), resetOnboardingData(), apiKey, host, isPostHogConfigured, posthog, formatBirthDateTime() (+6 more)

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (14): MihiraText(), ColorKey, ColorPalette, Colors, fonts, getThemeColorVariables(), GlassMorphism, Gradients (+6 more)

### Community 17 - "Community 17"
Cohesion: 0.12
Nodes (14): DailyIcon(), DailyIconProps, GuidanceIcon(), GuidanceIconProps, GurukulIcon(), GurukulIconProps, ProfileIcon(), ProfileIconProps (+6 more)

### Community 18 - "Community 18"
Cohesion: 0.2
Nodes (14): AskRequestPayload, buildEmptyRetrievalResponse(), defaultContext(), generateScriptureGuide(), normalizeMode(), buildAskComparePrompt(), buildAskSynthesisPrompt(), DailyPromptMoonProfile (+6 more)

### Community 19 - "Community 19"
Cohesion: 0.16
Nodes (13): ProfileSettingsSheet(), clearCachedProfile(), ProfileSnapshot, ThemePreference, DEFAULT_BIRTH_DATE, LANGUAGE_OPTIONS, ProfileFieldConfig, ProfileFieldId (+5 more)

### Community 20 - "Community 20"
Cohesion: 0.12
Nodes (14): AnimatedCircle, AnimatedLine, CLUSTER_POINTS, CONNECTIONS, ConstellationLoader(), KEYFRAME_RANGE, LINE_OPACITY_KEYFRAMES, SHAPE_ONE_POINTS (+6 more)

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (9): FEATURE_LABEL, FEATURE_LABEL_PLURAL, PaywallSheet(), getSubscriptionUserDetailsPatch(), isMirroredPlus(), Feature, LIMITS, UsageRow (+1 more)

### Community 22 - "Community 22"
Cohesion: 0.14
Nodes (11): response, MODE_CONTENT, ResponseModeSwitcherProps, onChange, SECTION_LAYOUT_TRANSITION, SOURCE_LAYOUT_TRANSITION, SourceCard(), SourceCardProps (+3 more)

### Community 23 - "Community 23"
Cohesion: 0.23
Nodes (10): ModelScriptureGuidePayload, retrievedSources, validateModelScriptureGuidePayload(), getScriptureModeConfig(), ScriptureModeConfig, distinctByScripture(), rankScriptureCandidates(), candidates (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.19
Nodes (13): cardRows(), esc(), generated, logoSvg, makeSvg(), outDir, pngPath, quicklookDir (+5 more)

### Community 25 - "Community 25"
Cohesion: 0.23
Nodes (11): redirectUrl, SignInProvider, useSignIn(), ArthData, useDailyArth(), createSupabaseSessionFromUrl(), getSupabaseClient(), getSupabaseConfig() (+3 more)

### Community 26 - "Community 26"
Cohesion: 0.27
Nodes (11): addSortIndicators(), enableUI(), getNthColumn(), getTable(), getTableBody(), getTableHeader(), loadColumns(), loadData() (+3 more)

### Community 27 - "Community 27"
Cohesion: 0.17
Nodes (9): config, { getDefaultConfig }, { withNativeWind }, content, files, fs, newTokens, path (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.17
Nodes (11): PremiumCard(), PremiumCardProps, AppBlurView(), GlassCard(), GlassCardProps, ToastContext, ToastContextValue, ToastInput (+3 more)

### Community 29 - "Community 29"
Cohesion: 0.31
Nodes (10): DEFAULT_CSV, DEFAULT_OUTPUT_DIR, generateImage(), main(), outputExists(), parseArgs(), parseCsv(), printHelp() (+2 more)

### Community 30 - "Community 30"
Cohesion: 0.29
Nodes (10): clearOnboardingCompleted(), getLocalOnboardingState(), getOnboardingCompleted(), getOnboardingState(), OnboardingCompletionOptions, OnboardingFlowState, OnboardingStatusOptions, serializeOnboardingData() (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.24
Nodes (8): AppAuthUser, AuthContext, AuthContextValue, AuthProvider(), EmailAddress, getStringMetadata(), mapSupabaseUser(), splitName()

### Community 32 - "Community 32"
Cohesion: 0.22
Nodes (9): FeatureRow(), FeatureRowProps, PlansScreen(), PlansScreenProps, FeaturedCard(), FeaturedCardProps, SacredButton(), { getByText } (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.22
Nodes (8): mockClient, mockEq, mockFrom, mockGetToken, mockSelect, mockSingle, mockUpdate, mockUpsert

### Community 34 - "Community 34"
Cohesion: 0.33
Nodes (8): CONSONANTS, containsDevanagari(), getSanskritDisplayText(), INDEPENDENT_VOWELS, matchLongest(), transliterateToDevanagari(), VOWEL_SIGNS, VOWELS

### Community 36 - "Community 36"
Cohesion: 0.47
Nodes (5): getAllUpcomingSacredDays(), getSacredDayById(), getTodaySacredDays(), NAVRATRI_DAYS, SACRED_CALENDAR

### Community 37 - "Community 37"
Cohesion: 0.7
Nodes (4): goToNext(), goToPrevious(), makeCurrent(), toggleClass()

## Knowledge Gaps
- **241 isolated node(s):** `size`, `display`, `googleSans`, `viewport`, `charmonman` (+236 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Text` connect `Community 0` to `Community 32`, `Community 1`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 10`, `Community 12`, `Community 13`, `Community 15`, `Community 16`, `Community 17`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 28`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `MihiraText()` connect `Community 16` to `Community 0`, `Community 4`, `Community 13`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `Community 12` to `Community 0`, `Community 1`, `Community 32`, `Community 2`, `Community 6`, `Community 8`, `Community 13`, `Community 15`, `Community 16`, `Community 17`, `Community 19`, `Community 20`, `Community 21`, `Community 28`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `size`, `display`, `googleSans` to the rest of the system?**
  _241 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._