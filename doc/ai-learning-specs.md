# Digital Writing Twin - AI & Learning Specifications

## AI Prompt Engineering

### System Prompt Architecture

#### Base System Prompt
```
You are a digital writing twin that learns and replicates a specific user's authentic communication style. Your primary goal is to enhance their writing while preserving their unique voice, tone, and personality.

Core Principles:
1. PRESERVE AUTHENTICITY: Maintain the user's natural voice and personality
2. ENHANCE CLARITY: Improve grammar, structure, and readability
3. RESPECT PATTERNS: Follow learned user preferences and patterns
4. NO EXPLANATIONS: Return only the enhanced version, no commentary
5. STAY IN CHARACTER: Write as if you ARE the user, just more polished

Never:
- Change the user's fundamental voice or personality
- Add content the user wouldn't naturally include
- Use phrases or words the user typically avoids
- Over-formalize casual communications
- Make the writing sound robotic or AI-generated
```

#### User Profile Integration
```
USER PROFILE:
Name: {userName}
Communication Style: {communicationStyle} 
Formality Level: {formalityLevel}
Explanation Preference: {explanationPreference}
Role/Context: {roleContext}
Preferred Phrases: {preferredPhrases}
Avoided Phrases: {avoidedPhrases}

LEARNED PATTERNS:
{dynamicLearnedPatterns}
```

#### Mode-Specific Contexts

**Professional Mode:**
```
CONTEXT: Professional Communication
Apply these adjustments:
- Slightly more formal tone while maintaining user's personality
- Clearer structure and organization
- Professional vocabulary where appropriate
- Proper email/business formatting
- Maintain user's level of warmth and approachability
```

**Casual Mode:**
```
CONTEXT: Casual Communication
Apply these adjustments:
- Preserve informal tone and personality
- Keep natural speech patterns
- Maintain user's typical informal vocabulary
- Don't over-correct casual expressions
- Preserve humor and personality markers
```

### Dynamic Prompt Construction

#### Pattern Integration Algorithm
```javascript
function buildUserPatterns(userId) {
  const patterns = getUserPatterns(userId);
  
  const vocabulary = patterns
    .filter(p => p.pattern_type === 'vocabulary')
    .map(p => `${p.pattern_data.trigger} → ${p.pattern_data.preferred}`)
    .join(', ');
    
  const structure = patterns
    .filter(p => p.pattern_type === 'structure')
    .map(p => p.pattern_data.description)
    .join('; ');
    
  const tone = patterns
    .filter(p => p.pattern_type === 'tone')
    .map(p => p.pattern_data.preference)
    .join(', ');
    
  return {
    vocabulary: vocabulary || 'No specific vocabulary patterns yet',
    structure: structure || 'No specific structure patterns yet',
    tone: tone || 'No specific tone patterns yet'
  };
}
```

#### Confidence-Based Pattern Application
```javascript
function applyPatternsToPrompt(patterns) {
  const highConfidencePatterns = patterns.filter(p => p.confidence_score > 0.7);
  const mediumConfidencePatterns = patterns.filter(p => p.confidence_score > 0.4 && p.confidence_score <= 0.7);
  
  let promptAddition = "";
  
  if (highConfidencePatterns.length > 0) {
    promptAddition += "STRONG PREFERENCES (always apply):\n";
    promptAddition += highConfidencePatterns.map(p => `- ${p.pattern_data.description}`).join('\n');
  }
  
  if (mediumConfidencePatterns.length > 0) {
    promptAddition += "\nMODERATE PREFERENCES (apply when relevant):\n";
    promptAddition += mediumConfidencePatterns.map(p => `- ${p.pattern_data.description}`).join('\n');
  }
  
  return promptAddition;
}
```

## Learning Algorithm Specifications

### Pattern Recognition System

#### Edit Analysis Framework
```javascript
class EditAnalyzer {
  constructor() {
    this.patternTypes = ['vocabulary', 'structure', 'tone', 'length'];
  }
  
  analyzeEdits(originalInput, aiOutput, userFinalOutput) {
    const edits = this.detectEdits(aiOutput, userFinalOutput);
    const patterns = [];
    
    for (const edit of edits) {
      patterns.push(...this.extractPatternsFromEdit(edit, originalInput, aiOutput, userFinalOutput));
    }
    
    return this.consolidatePatterns(patterns);
  }
  
  detectEdits(aiOutput, userOutput) {
    // Implementation of diff algorithm
    // Returns array of edit objects with type, position, original, modified
  }
  
  extractPatternsFromEdit(edit, originalInput, aiOutput, userFinalOutput) {
    const patterns = [];
    
    // Vocabulary pattern extraction
    if (edit.type === 'word_substitution') {
      patterns.push({
        type: 'vocabulary',
        trigger: edit.original,
        preferred: edit.modified,
        context: this.extractContext(edit, aiOutput),
        confidence: this.calculateInitialConfidence(edit)
      });
    }
    
    // Structure pattern extraction
    if (edit.type === 'sentence_restructure') {
      patterns.push({
        type: 'structure',
        description: this.analyzeStructurePreference(edit),
        context: 'sentence_level',
        confidence: this.calculateInitialConfidence(edit)
      });
    }
    
    // Tone pattern extraction
    if (edit.type === 'tone_adjustment') {
      patterns.push({
        type: 'tone',
        adjustment: this.analyzeToneShift(edit),
        context: edit.context,
        confidence: this.calculateInitialConfidence(edit)
      });
    }
    
    return patterns;
  }
}
```

#### Pattern Types and Examples

**1. Vocabulary Patterns**
```javascript
// Example patterns learned from user edits
const vocabularyPatterns = [
  {
    trigger: "utilize",
    preferred: "use",
    confidence: 0.9,
    context: "general",
    reinforced_count: 15
  },
  {
    trigger: "Hello [Name],",
    preferred: "Hi [Name]!",
    confidence: 0.8,
    context: "email_greeting",
    reinforced_count: 8
  },
  {
    trigger: "Please find attached",
    preferred: "I've attached",
    confidence: 0.7,
    context: "email_attachment",
    reinforced_count: 5
  }
];
```

**2. Structure Patterns**
```javascript
const structurePatterns = [
  {
    description: "Prefers shorter paragraphs (2-3 sentences max)",
    confidence: 0.85,
    context: "email",
    examples: [
      "Split long paragraphs into shorter ones",
      "Break up complex sentences"
    ]
  },
  {
    description: "Uses bullet points for lists instead of numbered lists",
    confidence: 0.9,
    context: "general",
    examples: ["Changed numbered list to bullet points"]
  },
  {
    description: "Prefers direct statements over hedging language",
    confidence: 0.75,
    context: "professional",
    examples: [
      "Removed 'I think that maybe'",
      "Changed 'possibly' to direct statement"
    ]
  }
];
```

**3. Tone Patterns**
```javascript
const tonePatterns = [
  {
    adjustment: "Adds warmth to professional communications",
    confidence: 0.8,
    context: "professional_email",
    examples: [
      "Added 'Hope you're doing well!' to opening",
      "Changed 'As discussed' to 'Following up on our chat'"
    ]
  },
  {
    adjustment: "Maintains casual tone even when correcting grammar",
    confidence: 0.9,
    context: "casual",
    examples: [
      "Fixed grammar but kept 'gonna' instead of 'going to'",
      "Preserved conversational contractions"
    ]
  }
];
```

**4. Length Patterns**
```javascript
const lengthPatterns = [
  {
    preference: "Prefers concise responses (50-75% of AI suggestion length)",
    confidence: 0.8,
    context: "email",
    average_reduction: 0.35
  },
  {
    preference: "Expands brief AI responses for important topics",
    confidence: 0.6,
    context: "detailed_explanation",
    expansion_triggers: ["technical topics", "project planning"]
  }
];
```

### Learning Reinforcement Algorithm

#### Confidence Scoring System
```javascript
class ConfidenceScorer {
  calculateConfidence(pattern) {
    const baseConfidence = 0.5;
    const reinforcementBoost = Math.min(pattern.usage_count * 0.1, 0.4);
    const recencyBoost = this.calculateRecencyBoost(pattern.last_reinforced);
    const consistencyBoost = this.calculateConsistencyBoost(pattern.consistency_score);
    
    return Math.min(
      baseConfidence + reinforcementBoost + recencyBoost + consistencyBoost,
      1.0
    );
  }
  
  calculateRecencyBoost(lastReinforced) {
    const daysSince = (Date.now() - new Date(lastReinforced)) / (1000 * 60 * 60 * 24);
    if (daysSince < 1) return 0.1;
    if (daysSince < 7) return 0.05;
    if (daysSince < 30) return 0.02;
    return 0;
  }
  
  calculateConsistencyBoost(consistencyScore) {
    return consistencyScore * 0.2; // Max 0.2 boost for 100% consistency
  }
}
```

#### Pattern Evolution and Decay
```javascript
class PatternEvolution {
  updatePatternConfidence(patternId, reinforcement) {
    const pattern = this.getPattern(patternId);
    
    if (reinforcement === 'positive') {
      pattern.confidence_score = Math.min(pattern.confidence_score + 0.1, 1.0);
      pattern.usage_count += 1;
      pattern.last_reinforced = new Date();
    } else if (reinforcement === 'negative') {
      pattern.confidence_score = Math.max(pattern.confidence_score - 0.2, 0.1);
      pattern.contradiction_count += 1;
    }
    
    // Apply temporal decay for unused patterns
    this.applyTemporalDecay(pattern);
    
    // Remove patterns with very low confidence
    if (pattern.confidence_score < 0.1 && pattern.usage_count < 3) {
      this.removePattern(patternId);
    }
  }
  
  applyTemporalDecay(pattern) {
    const daysSinceLastReinforced = (Date.now() - new Date(pattern.last_reinforced)) / (1000 * 60 * 60 * 24);
    const decayRate = 0.01; // 1% decay per day
    const decay = Math.min(daysSinceLastReinforced * decayRate, 0.3); // Max 30% decay
    
    pattern.confidence_score = Math.max(pattern.confidence_score - decay, 0.1);
  }
}
```

### Context-Aware Learning

#### Context Detection
```javascript
class ContextAnalyzer {
  detectContext(input, mode) {
    const contexts = {
      email: this.isEmailContext(input),
      social_media: this.isSocialMediaContext(input),
      technical: this.isTechnicalContext(input),
      creative: this.isCreativeContext(input),
      formal: this.isFormalContext(input, mode),
      casual: this.isCasualContext(input, mode)
    };
    
    return Object.entries(contexts)
      .filter(([context, confidence]) => confidence > 0.5)
      .map(([context, confidence]) => ({ context, confidence }));
  }
  
  isEmailContext(input) {
    const emailIndicators = [
      /^(hi|hello|dear)\s+\w+/i,
      /(best regards|sincerely|thanks|cheers)/i,
      /@\w+\.(com|org|edu)/i,
      /(meeting|attached|follow up|following up)/i
    ];
    
    const matches = emailIndicators.filter(pattern => pattern.test(input)).length;
    return Math.min(matches / emailIndicators.length, 1.0);
  }
  
  isTechnicalContext(input) {
    const technicalTerms = ['API', 'database', 'server', 'code', 'implementation', 'architecture'];
    const termCount = technicalTerms.filter(term => 
      input.toLowerCase().includes(term.toLowerCase())
    ).length;
    
    return Math.min(termCount / 3, 1.0); // Confidence scales with technical term density
  }
}
```

#### Context-Specific Pattern Application
```javascript
class ContextualPatternMatcher {
  getRelevantPatterns(userPatterns, detectedContexts) {
    return userPatterns.filter(pattern => {
      // Apply patterns based on context match and confidence
      const hasMatchingContext = detectedContexts.some(context => 
        pattern.context === context.context && context.confidence > 0.5
      );
      
      const hasGeneralContext = pattern.context === 'general';
      const hasHighConfidence = pattern.confidence_score > 0.7;
      
      return hasMatchingContext || (hasGeneralContext && hasHighConfidence);
    }).sort((a, b) => b.confidence_score - a.confidence_score); // Sort by confidence
  }
}
```

### Learning Performance Metrics

#### Learning Progress Calculation
```javascript
class LearningProgressTracker {
  calculateLearningProgress(userId) {
    const sessions = this.getUserSessions(userId);
    const patterns = this.getUserPatterns(userId);
    
    const metrics = {
      sessionsCompleted: sessions.length,
      patternsLearned: patterns.length,
      highConfidencePatterns: patterns.filter(p => p.confidence_score > 0.7).length,
      recentAccuracy: this.calculateRecentAccuracy(sessions.slice(-10)),
      improvementTrend: this.calculateImprovementTrend(sessions),
      consistencyScore: this.calculateConsistencyScore(patterns)
    };
    
    return this.synthesizeLearningScore(metrics);
  }
  
  calculateRecentAccuracy(recentSessions) {
    if (recentSessions.length === 0) return 0;
    
    const averageEdits = recentSessions.reduce((sum, session) => {
      return sum + this.countSignificantEdits(session);
    }, 0) / recentSessions.length;
    
    // Lower edit count = higher accuracy
    return Math.max(0, 1 - (averageEdits / 20)); // Normalize to 0-1 scale
  }
  
  synthesizeLearningScore(metrics) {
    const weights = {
      patterns: 0.3,
      accuracy: 0.4,
      improvement: 0.2,
      consistency: 0.1
    };
    
    const normalizedPatterns = Math.min(metrics.highConfidencePatterns / 50, 1.0);
    const score = (
      normalizedPatterns * weights.patterns +
      metrics.recentAccuracy * weights.accuracy +
      metrics.improvementTrend * weights.improvement +
      metrics.consistencyScore * weights.consistency
    ) * 100;
    
    return Math.round(score);
  }
}
```

### Error Handling and Edge Cases

#### Pattern Conflict Resolution
```javascript
class PatternConflictResolver {
  resolveConflicts(conflictingPatterns) {
    // Group patterns by type and context
    const grouped = this.groupPatterns(conflictingPatterns);
    
    return grouped.map(group => {
      if (group.length === 1) return group[0];
      
      // Resolve conflicts based on:
      // 1. Recency (newer patterns preferred)
      // 2. Confidence score
      // 3. Usage frequency
      // 4. Context specificity
      
      return group.sort((a, b) => {
        const recencyScore = this.compareRecency(a, b);
        if (recencyScore !== 0) return recencyScore;
        
        const confidenceScore = b.confidence_score - a.confidence_score;
        if (Math.abs(confidenceScore) > 0.1) return confidenceScore;
        
        return b.usage_count - a.usage_count;
      })[0];
    });
  }
}
```

#### Anomaly Detection
```javascript
class AnomalyDetector {
  detectAnomalousEdits(session) {
    const anomalies = [];
    
    // Detect complete rewrites (might indicate AI failure)
    const editDistance = this.calculateEditDistance(session.ai_output, session.final_output);
    if (editDistance > 0.8) {
      anomalies.push({
        type: 'complete_rewrite',
        confidence: editDistance,
        suggestion: 'AI output may have been completely off-brand'
      });
    }
    
    // Detect contradictory patterns
    const contradictions = this.findPatternContradictions(session);
    anomalies.push(...contradictions);
    
    return anomalies;
  }
}
```

This comprehensive AI and learning specification provides the foundation for building a sophisticated writing twin that genuinely learns and adapts to user preferences while maintaining their authentic voice.