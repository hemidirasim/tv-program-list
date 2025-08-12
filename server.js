const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files - Vercel üçün
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Boş TV proqram məlumatları
let tvPrograms = {
  bazarertesi: [],
  cersenbe: [],
  carsanbe: [],
  cume: [],
  cumeaxsami: [],
  senbe: [],
  bazar: []
};

// Gün başlıqları və qeydləri
let dayInfo = {
  bazarertesi: { title: 'Bazar ertəsi', notes: '' },
  cersenbe: { title: 'Çərşənbə axşamı', notes: '' },
  carsanbe: { title: 'Çərşənbə', notes: '' },
  cume: { title: 'Cümə axşamı', notes: '' },
  cumeaxsami: { title: 'Cümə', notes: '' },
  senbe: { title: 'Şənbə', notes: '' },
  bazar: { title: 'Bazar', notes: '' }
};

// Ana səhifə
app.get('/', (req, res) => {
  res.render('index', { tvPrograms, dayInfo });
});

// Günə görə proqram
app.get('/gun/:day', (req, res) => {
  const day = req.params.day;
  const programs = tvPrograms[day] || [];
  const dayData = dayInfo[day] || { title: day, notes: '' };
  res.render('day', { day, programs, dayData });
});

// API - bütün proqramları al
app.get('/api/programs', (req, res) => {
  res.json(tvPrograms);
});

// API - günə görə proqramları al
app.get('/api/programs/:day', (req, res) => {
  const day = req.params.day;
  const programs = tvPrograms[day] || [];
  res.json(programs);
});

// API - yeni proqram əlavə et
app.post('/api/programs/:day', (req, res) => {
  const day = req.params.day;
  const { time, program, description, channel } = req.body;
  
  if (!tvPrograms[day]) {
    tvPrograms[day] = [];
  }
  
  tvPrograms[day].push({ time, program, description, channel });
  res.json({ success: true, message: 'Proqram əlavə edildi' });
});

// API - proqramı sil
app.delete('/api/programs/:day/:index', (req, res) => {
  const { day, index } = req.params;
  
  if (tvPrograms[day] && tvPrograms[day][index]) {
    tvPrograms[day].splice(index, 1);
    res.json({ success: true, message: 'Proqram silindi' });
  } else {
    res.status(404).json({ success: false, message: 'Proqram tapılmadı' });
  }
});

// API - gün başlığını və qeydlərini yenilə
app.put('/api/day-info/:day', (req, res) => {
  const day = req.params.day;
  const { title, notes } = req.body;
  
  if (!dayInfo[day]) {
    dayInfo[day] = { title: '', notes: '' };
  }
  
  dayInfo[day].title = title || dayInfo[day].title;
  dayInfo[day].notes = notes || dayInfo[day].notes;
  
  res.json({ 
    success: true, 
    message: 'Gün məlumatları yeniləndi',
    dayInfo: dayInfo[day]
  });
});

// API - Word-dən kopyalanan mətnləri parse et
app.post('/api/parse-text', (req, res) => {
  const { text, day } = req.body;
  
  if (!text || !day) {
    return res.status(400).json({ success: false, message: 'Mətn və gün tələb olunur' });
  }
  
  try {
    const programs = parseProgramText(text);
    tvPrograms[day] = programs;
    
    res.json({ 
      success: true, 
      message: `${programs.length} proqram əlavə edildi`,
      programs: programs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Parse xətası: ' + error.message });
  }
});

// Word mətnini parse etmə funksiyası
function parseProgramText(text) {
  const programs = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    // **07:00:** "Telesəhər". Musiqi-informasiya proqramı formatını axtarırıq
    const timeMatch = line.match(/\*\*(\d{1,2}:\d{2}):\*\*\s*"([^"]+)"(?:\.\s*(.+))?/);
    
    if (timeMatch) {
      const time = timeMatch[1];
      const program = timeMatch[2];
      const description = timeMatch[3] || '';
      
      programs.push({
        time: time,
        program: program,
        description: description.trim(),
        channel: 'AzTV'
      });
    }
  }
  
  return programs;
}

// HTML export səhifəsi


// Kopyalama formatı üçün API
app.get('/api/copy/:day', (req, res) => {
  const day = req.params.day;
  const programs = tvPrograms[day] || [];
  const dayData = dayInfo[day] || { title: day, notes: '' };
  
  const dayName = dayData.title;
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('az-AZ', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  let copyText = `${dayName} (${dateStr})\n\n`;
  
  programs.forEach(program => {
    copyText += `*   **${program.time}:** "${program.program}"`;
    if (program.description) {
      copyText += `. ${program.description}`;
    }
    copyText += '\n';
  });
  
  // Qeydləri də əlavə et
  if (dayData.notes) {
    copyText += `\n${dayData.notes}\n`;
  }
  
  res.json({ 
    success: true, 
    copyText: copyText,
    dayName: dayName,
    date: dateStr
  });
});

// Export məlumatları üçün API
app.get('/api/export-data', (req, res) => {
  res.json({
    success: true,
    tvPrograms: tvPrograms,
    dayInfo: dayInfo
  });
});

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} ünvanında işləyir`);
});
