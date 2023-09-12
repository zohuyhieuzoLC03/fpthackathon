const express = require('express');
const app = express();
const { spawn } = require('child_process');
const path = require('path');
const multer = require('multer');

// Khai báo đường dẫn tới các file script Python
const pythonScriptNode = path.join(__dirname, 'node.py');
const pythonScriptQuiz = path.join(__dirname, 'quiz.py');
const pythonScriptQuiz_TF = path.join(__dirname, 'quiz_TF.py');
const pythonScriptSummary = path.join(__dirname, 'summarize.py');
const pythonScriptChatbot = path.join(__dirname, 'chatbot.py');
const pythonScriptImageV = path.join(__dirname, 'image_to_text_vie.py');
const pythonScriptDailyQuiz = path.join(__dirname, 'daily_quiz.py')
const pythonScriptSoundV = path.join(__dirname, 'speech_to_text.py');

// Hàm chạy script Python và trả về kết quả thông qua Promise
const runPythonScript = (pythonScript, args) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [pythonScript, ...args]);
    let result = '';

    // Lắng nghe sự kiện stdout từ child process để nhận kết quả
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    // Lắng nghe sự kiện stderr từ child process để xử lý lỗi nếu có
    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });

    // Lắng nghe sự kiện khi child process kết thúc
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(`Child process exited with code ${code}`);
      } else {
        resolve(JSON.parse(result));
      }
    });
  });
};


// Khởi động server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.post('/api/nodes', async (req, res) => {
  try {
    const { text } = req.body;
    const nodes = await runPythonScript(pythonScriptNode, [text]);
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post('/api/quizzes', async (req, res) => {
  try {
    const { text } = req.body;
    const quizzes = await runPythonScript(pythonScriptQuiz, [text]);
    res.json(quizzes);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error });
  }
});

app.post('/api/quizzes_TF', async (req, res) => {
  try {
    const { text } = req.body;
    const quizzes_TF = await runPythonScript(pythonScriptQuiz_TF, [text]);
    res.json(quizzes_TF);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error });
  }
});

app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    const summary = await runPythonScript(pythonScriptSummary, [text]);
    res.json(summary);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
}
)

app.post('/api/chatbot', async (req, res) => {
  try {
    const { text } = req.body;
    const summary = await runPythonScript(pythonScriptChatbot, [text]);
    res.json(summary);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
}
)

app.get('/api/daily_quiz', async (req, res) => {
  try {
    list_subject = ["Văn hóa và xã hội","Giáo dục","Môi trường","Chính trị và chính quyền","Kinh tế","Y học và sức khỏe","Giải trí - Thể thao","Ngôn ngữ","Khoa học và Công nghệ","Nghệ thuật - Văn học","Quân sự","Lịch sử","Địa lý","Tôn giáo","Truyền thông","Thời trang","Gia đình và giới tính","Thực phẩm và ẩm thực","Du lịch","Tài chính"]
    const randomSubject = list_subject[Math.floor(Math.random() * list_subject.length)];
    const { text } = randomSubject;
    const daily_text = await runPythonScript(pythonScriptDailyQuiz, [text]);
    res.json(daily_text);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
}
)

const upload_image = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'image/'));
    },
    filename: (req, file, cb) => {
      cb(null, 'upload_image.png');
    },
  }),
});
app.post('/api/upload_image', upload_image.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file received.' });
    }
    const text = await runPythonScript(pythonScriptImageV, ['']);

    res.json(text); // Trả về nội dung file dưới dạng chuỗi
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

const upload_sound = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'sound/'));
    },
    filename: (req, file, cb) => {
      cb(null, 'upload_sound.mp3');
    },
  }),
});
app.post('/api/upload_sound', upload_sound.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file received.' });
    }
    const text = await runPythonScript(pythonScriptSoundV, ['']);

    res.json(text); // Trả về nội dung file dưới dạng chuỗi
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});