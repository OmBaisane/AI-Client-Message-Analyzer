# ClientBrief AI

**Turn client messages into structured project briefs.**

ClientBrief AI is an AI-powered client message analyzer built to help developers understand project inquiries, identify missing details, and prepare professional responses before committing to project scope, pricing, or deadlines.

## Features

- **Project classification:** Identify the type of project described by a client.
- **Urgency estimation:** Estimate urgency from explicit deadlines and time-sensitive language.
- **Requirement extraction:** Organize the requirements stated in a client message.
- **Missing information detection:** Identify details that need clarification.
- **Suggested replies:** Generate professional, editable response drafts.
- **Action items:** Turn an inquiry into practical next steps.
- **AI streaming:** Stream responses progressively in the chat interface.
- **Cancellation support:** Stop an in-progress streaming response.
- **Input validation:** Validate incoming requests and reject invalid or oversized messages.
- **Structured AI output:** Validate the generated analysis before returning it to the client.

AI-generated results are suggestions, not verified facts or guaranteed project commitments. Developers should review the analysis before communicating with clients.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Google Gemini API
- `@google/genai`

## Getting Started

### Prerequisites

- Node.js version compatible with the project's Next.js version
- npm
- A Google Gemini API key

### Installation

Clone the repository:

```bash
git clone https://github.com/OmBaisane/AI-Client-Analyzer.git
cd AI-Client-Analyzer
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder with your own Gemini API key.

Never commit `.env.local` or expose your API key in client-side code.

### Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### `POST /api/analyze`

Analyzes a client message and returns a structured project intake report.

**Request body:**

```json
{
  "message": "I need a welding business website within 10 days and my budget is 10000rs."
}
```

The analysis includes:

- Project type
- Estimated urgency
- Requirements
- Missing information
- Suggested reply
- Action items

The endpoint validates the request and AI response before returning the result.

### `POST /api/stream`

Streams an AI-generated response for the conversation interface.

The streaming flow supports progressive output, cancellation, and request validation. The client handles streaming events and only saves a response as complete after receiving the completion event.

## Validation and Error Handling

The application validates incoming message data, handles malformed JSON, enforces input limits, and checks the structure of generated analysis.

The analysis endpoint rejects messages longer than 12,000 characters. The streaming endpoint also enforces its own message and conversation-context limits.

Provider failures and invalid AI responses are handled with error responses instead of treating incomplete output as a successful analysis.

## Quality Checks

Run a production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Run both checks:

```bash
npm run build && npm run lint
```

## Deployment

ClientBrief AI can be deployed to Vercel.

1. Import the GitHub repository into Vercel.
2. Configure `GEMINI_API_KEY` in the project's environment variables.
3. Enable the environment variable for the deployment environments you intend to use.
4. Deploy the application.
5. Test client analysis, streaming, cancellation, and error handling on the deployed URL.

Keep the Gemini API key in server-side environment variables. Do not put secrets in `NEXT_PUBLIC_*` variables.

## Security and Responsible Use

- Never commit API keys or other secrets.
- Treat client messages as untrusted input.
- Review AI-generated requirements, urgency estimates, and suggested replies before relying on them.
- Confirm project scope, pricing, feasibility, and deadlines with the client.
- Do not treat an AI-generated report as a guarantee that a project is feasible or secure.

## Project Status

ClientBrief AI is being prepared for its initial V1 release. Deployment and live production verification must be completed before the release is considered finished.

## Author

**Om Baisane**

- GitHub: [@OmBaisane](https://github.com/OmBaisane)
- Repository: [AI-Client-Analyzer](https://github.com/OmBaisane/AI-Client-Message-Analyzer)
-
