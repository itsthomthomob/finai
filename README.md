# FinAI
An AI-powered finance tool.

## Getting Started

### Pre Reqs
- Node (Versions after v16)
- NPM

### Set-up
1. Clone repo into a separate folder
2. Open terminal, ``cd`` into folder with repo
3. Run ``npm install``
4. Run ``npm run dev``

### Technologies Used
- Next.JS (front end and back end)
- Material UI (for styling and UI consistency)
- Pinecone (for vector databases)

### Planned Features
- Public Features
  - Stock Market Sentiment Analysis
  - Stock Ticker Price Prediction
  - AI-Powered Budgeting
- Enterprise Features (Still considering)
  - Financial Risk Analysis
  - Fraud Detection (Transactions, Hidden Expenses)
  - Corporate Risk Assessments

### Development Log

**April 11**

Initialized the FinAI project. Created a Next.JS application with Create Next App, installed dependencies: Material-UI, Mui Icons, Pinecone, Redux, and others. Downloaded training data based on tweets and labels from [this 'twitter financial news' dataset](https://www.kaggle.com/datasets/sulphatet/twitter-financial-news?resource=download).

Studied/investigated a bit on Word2Vec, a training model to generate embedded words for vector values. [This medium article](https://towardsdatascience.com/word2vec-explained-49c52b4ccb71) was very useful in explaining W2V works.

Generated a vector chart of each word, the closer each point is the closer the actual meaning of the word is
![Chart](https://raw.githubusercontent.com/itsthomthomob/finai/main/process_data/word_clusters.png)
