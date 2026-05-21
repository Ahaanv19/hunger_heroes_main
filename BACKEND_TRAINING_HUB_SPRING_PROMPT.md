# Spring Boot Backend Prompt - Training Hub Game Sessions

> Purpose: Copy this prompt into Copilot to generate the Spring Boot backend for the Training Hub starter-map game.

---

## Prompt

Build a Spring Boot backend module for the Hunger Heroes Training Hub starter map. The frontend page is `navigation/training.md`, and its game wrapper now saves session data through `assets/js/projects/training-hub/training-game/levels/TrainingHubSessionApi.js`.

The current frontend behavior is:

- POST a completed or in-progress training run to Spring first.
- Fall back to local browser storage if Spring is offline.
- Fetch a leaderboard from Spring with `levelId` and `limit` query params.

Match that contract exactly.

### Required Endpoints

Implement these endpoints under `/api/training-hub`:

1. `POST /api/training-hub/sessions`
2. `GET /api/training-hub/sessions/leaderboard?levelId=training-hub-team-starter-map&limit=5`
3. `GET /api/training-hub/sessions/user/{personId}`

The frontend currently uses `POST /sessions` and `GET /sessions/leaderboard`, but add the user endpoint for parity with the rest of the project.

### Request Shape

Accept this JSON request body for `POST /api/training-hub/sessions`:

```json
{
  "playerName": "Volunteer",
  "levelId": "training-hub-team-starter-map",
  "checkpointsVisited": 4,
  "checkpointsTotal": 5,
  "dialoguesCompleted": 4,
  "timePlayedSeconds": 142,
  "completionRate": 80,
  "completed": false,
  "checkpoints": ["WelcomeZone", "ArtZone", "CopyZone", "FlowZone"],
  "score": 683,
  "details": "{\"checkpoints\":[\"WelcomeZone\",\"ArtZone\",\"CopyZone\",\"FlowZone\"],\"completionRate\":80,\"completed\":false,\"source\":\"training-hub-web\",\"classifier\":{\"totalScenarios\":6,\"attempts\":5,\"correct\":5,\"bonusScore\":25}}",
  "payload": {
    "checkpoints": ["WelcomeZone", "ArtZone", "CopyZone", "FlowZone"],
    "completionRate": 80,
    "completed": false,
    "source": "training-hub-web",
    "classifier": {
      "totalScenarios": 6,
      "attempts": 5,
      "correct": 5,
      "bonusScore": 25
    }
  },
  "createdAt": "2026-05-12T18:30:00.000Z"
}
```

### Server Rules

Do not trust client-computed values. Recompute all derived fields on the server.

Server-side score formula:

```text
baseScore = (checkpointsVisited * 100)
      + (dialoguesCompleted * 25)
      + max(0, 300 - timePlayedSeconds)

classifierCorrect = clamp(payload.classifier.correct, 0, 6)
classifierBonus = classifierCorrect * 5

score = baseScore + classifierBonus
```

Also recompute:

- `completionRate = round((checkpointsVisited / checkpointsTotal) * 100)`
- `completed = checkpointsVisited >= checkpointsTotal`
- `classifierAttempts = max(0, payload.classifier.attempts)`
- `classifierCorrect = clamp(payload.classifier.correct, 0, 6)`
- `classifierBonus = classifierCorrect * 5`

Clamp invalid values:

- `checkpointsVisited` between `0` and `checkpointsTotal`
- `checkpointsTotal` minimum `1`
- `dialoguesCompleted` minimum `0`
- `timePlayedSeconds` minimum `0`
- missing `payload.classifier` should behave like `attempts = 0`, `correct = 0`, `bonus = 0`

Keep the raw `payload` and `details` data. The frontend uses `payload.classifier` to describe the pass/fail arrow portion of the run.

### Entity Design

Create a JPA entity named `TrainingHubSession` with fields similar to:

```java
@Entity
@Table(name = "training_hub_sessions")
public class TrainingHubSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long personId;
    private String personUid;

    @Column(length = 100)
    private String playerName;

    @Column(length = 80)
    private String levelId;

    private Integer checkpointsVisited;
    private Integer checkpointsTotal;
    private Integer dialoguesCompleted;
    private Integer timePlayedSeconds;
    private Integer completionRate;
    private Boolean completed;
    private Integer classifierAttempts;
    private Integer classifierCorrect;
    private Integer classifierBonusScore;
    private Integer score;

    @Lob
    private String details;

    @Lob
    private String payload;

    private LocalDateTime createdAt;
}
```

If your project already has a `Person` or `User` entity, link to it using the established project pattern. Keep the player linkage nullable so anonymous training runs still save.

### Repository Requirements

Create a `TrainingHubSessionRepository` with methods for:

- all sessions for one person, newest first
- leaderboard by `levelId`, ordered by `score DESC`, then `timePlayedSeconds ASC`, then `createdAt DESC`
- top `N` sessions overall if `levelId` is omitted

If Spring Data derived queries are not flexible enough for `limit`, use `PageRequest` instead of non-portable JPQL `LIMIT`.

### Controller Requirements

Create a controller named `TrainingHubSessionController` under the same package.

Requirements:

1. `POST /sessions`
   - validate required fields
   - recompute score and derived values server-side
  - preserve `payload.classifier` and keep `details` in sync with it
   - set `createdAt` if missing
   - return the saved record as JSON with camelCase keys
2. `GET /sessions/leaderboard`
   - accept `levelId` and `limit`
   - default `levelId` to `training-hub-team-starter-map`
   - default `limit` to `5`
   - cap `limit` at `20`
3. `GET /sessions/user/{personId}`
   - return that user's sessions newest first

### Response Shape

Return camelCase JSON. A saved session should look like:

```json
{
  "id": 12,
  "personId": 7,
  "personUid": "uid-demo-user",
  "playerName": "Volunteer",
  "levelId": "training-hub-team-starter-map",
  "checkpointsVisited": 4,
  "checkpointsTotal": 5,
  "dialoguesCompleted": 4,
  "timePlayedSeconds": 142,
  "completionRate": 80,
  "completed": false,
  "classifierAttempts": 5,
  "classifierCorrect": 5,
  "classifierBonusScore": 25,
  "score": 683,
  "details": "{\"checkpoints\":[\"WelcomeZone\",\"ArtZone\",\"CopyZone\",\"FlowZone\"],\"completionRate\":80,\"completed\":false,\"source\":\"training-hub-web\",\"classifier\":{\"totalScenarios\":6,\"attempts\":5,\"correct\":5,\"bonusScore\":25}}",
  "payload": "{\"checkpoints\":[\"WelcomeZone\",\"ArtZone\",\"CopyZone\",\"FlowZone\"],\"completionRate\":80,\"completed\":false,\"source\":\"training-hub-web\",\"classifier\":{\"totalScenarios\":6,\"attempts\":5,\"correct\":5,\"bonusScore\":25}}",
  "createdAt": "2026-05-12T18:30:00"
}
```

### CORS and Auth

Follow the existing backend conventions in this repo.

- Allow the frontend origins already used by the Hunger Heroes site.
- If the rest of the project protects write endpoints, keep the same auth pattern here.
- If auth is required, keep anonymous saves possible only if the current project already allows them for game scores.

### Seed Data

Add a small seed helper with 3 sample sessions for `training-hub-team-starter-map` so the leaderboard is easy to test.

### Testing Checklist

- `POST /api/training-hub/sessions` persists a session
- server overwrites any incorrect client `score`
- server overwrites any incorrect client classifier bonus using `payload.classifier.correct`
- `GET /api/training-hub/sessions/leaderboard?levelId=training-hub-team-starter-map&limit=5` returns at most 5 rows
- leaderboard ordering prefers higher score, then faster time
- `GET /api/training-hub/sessions/user/{personId}` only returns that user's sessions
- invalid negative inputs are clamped or rejected predictably

### Suggested File Layout

```text
src/main/java/.../traininghub/
  TrainingHubSession.java
  TrainingHubSessionRepository.java
  TrainingHubSessionController.java
```

Use the existing project package names and coding style instead of inventing a new architecture.