import dotenv from 'dotenv';
dotenv.config();
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";


export const run = async() =>{
/* Initialize the LLM to use to answer the question */
const model = new OpenAI({openAIApiKey :process.env.OPENAI_API_KEY });
/* Load in the file we want to do question answering over */
const text = fs.readFileSync("two-leaves.txt", "utf8");
/* Split the text into chunks */
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);
/* Create the vectorstore */
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
/* Create the chain */
const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever()
);

const result = await chain.call({ question : prompt, chat_history: [] });

console.log(result)

}

run()