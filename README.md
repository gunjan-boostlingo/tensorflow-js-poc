POC demo to demonstrate extractive question answering with a BERT model fine-tuned on SQUAD 2.0 using Tensorflow.js. Built in part by following https://github.com/tensorflow/tfjs-models/tree/master/qna and https://github.com/SharanSMenon/question-answering-tfjs/tree/main.

Given a passage and a question, this demo will output an answer combined with the extracted context BERT used to answer the question. Run the command http-server in order to run this repository.

Overall, this works as well as I would expect from 2018-era technology, which is that if there is an explicit answer to the question in the passage, the model will get things right on a hit-or-miss basis. If you're used to modern-day ChatGPT-level question-answering, then you will likely will be disappointed - but that just shows how much technology has changed in the last seven years.
