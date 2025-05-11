# ETH Buying AI Agent

An intelligent AI-powered dApp that helps users buy ETH directly within the application, providing real-time insights and assistance for cryptocurrency transactions.

## 🌟 Features

- 🤖 AI-powered transaction assistance
- 💰 Direct ETH purchasing interface
- 📊 Real-time price monitoring
- 🔒 Secure transaction handling
- 💳 Multiple wallet support
- 📱 Responsive and intuitive UI

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or other Web3 wallet
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd eth-buying-ai-agent
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_INFURA_KEY=your_infura_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Web3**: ethers.js, web3modal
- **AI**: OpenAI API
- **Styling**: Tailwind CSS
- **Testing**: Jest, Testing Library
- **Price Feeds**: CoinGecko API, Chainlink

## 📝 Project Structure

```
eth-buying-ai-agent/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Next.js pages
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── services/      # API and Web3 services
│   └── styles/        # Global styles
├── public/            # Static assets
├── tests/             # Test files
└── scripts/           # Utility scripts
```

## 🔒 Security

- All transactions are signed client-side
- No private keys are stored
- Multiple security audits
- Comprehensive error handling
- Rate limiting and input validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Ethereum community for Web3 tools
- All contributors and supporters

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.