// server.ts

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { Submission } from './submission.interface'; // Import Submission interface

const app = express();
const PORT = 8000;
const FILE_PATH = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

let submissions: Submission[] = [];

// Load existing submissions from the JSON file if it exists
if (fs.existsSync(FILE_PATH)) {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    submissions = JSON.parse(data);
  } catch (error) {
    console.error('Error reading or parsing db.json:', error);
  }
}

app.get('/ping', (req: Request, res: Response) => {
  res.json({ success: true });
});

// POST endpoint to submit a new entry
app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time }: Submission = req.body;

  submissions.push({ name, email, phone, github_link, stopwatch_time });

  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(submissions, null, 2));
    res.status(200).send('Submission received');
    console.log('Number of submissions:', submissions.length);
  } catch (error) {
    console.error('Error writing to db.json:', error);
    res.status(500).send('Internal server error');
  }
});

// GET endpoint to fetch all submissions or by index
app.get('/read', (req: Request, res: Response) => {
  const indexStr = req.query.index as string;

  if (typeof indexStr !== 'string') {
    return res.status(400).send('Invalid index parameter');
  }

  const index = parseInt(indexStr, 10);

  if (isNaN(index) || index < 0 || index >= submissions.length) {
    return res.status(404).send('No Submission found');
  }

  res.json(submissions[index]);
});

// DELETE endpoint to delete a submission by index
app.delete('/delete', (req: Request, res: Response) => {
  const indexStr = req.query.index as string;

  if (typeof indexStr !== 'string') {
    return res.status(400).send('Invalid index parameter');
  }

  const index = parseInt(indexStr, 10);

  if (isNaN(index) || index < 0 || index >= submissions.length) {
    return res.status(404).send('No Submission found');
  }

  // Remove the submission at the specified index
  submissions.splice(index, 1);

  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(submissions, null, 2));
    res.status(200).send('Submission deleted');
    console.log('Deleted submission at index:', index);
  } catch (error) {
    console.error('Error writing to db.json:', error);
    res.status(500).send('Internal server error');
  }
});

// PUT endpoint to edit a submission by index
app.put('/update/:index', (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time }: Submission = req.body;
  const index = parseInt(req.params.index, 10); // Parse index from URL params

  // Validate index
  if (isNaN(index) || index < 0 || index >= submissions.length) {
    return res.status(400).send('Invalid index');
  }

  // Update the submission data at the specified index
  submissions[index] = { name, email, phone, github_link, stopwatch_time };

  // Save the updated submissions to the JSON file or database
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(submissions, null, 2));
    console.log('Updated submission:', submissions[index]);
    res.status(200).send('Submission updated');
  } catch (error) {
    console.error('Error writing to db.json:', error);
    res.status(500).send('Internal server error');
  }
});


// GET endpoint to search for submission by email
app.get('/search', (req, res) => {
  const email = req.query.email;

  if (!email || typeof email !== 'string') {
    return res.status(400).send('Invalid email parameter');
  }

  const foundIndex = submissions.findIndex((submission) => submission.email === email);

  if (foundIndex === -1) {
    return res.status(404).send('No submission found with the provided email');
  }

  res.json({ ...submissions[foundIndex], index: foundIndex });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
