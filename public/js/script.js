// Gün başlığını dəyişmə funksiyaları
function editDayTitle(day) {
    const modal = document.getElementById('editTitleModal');
    const titleInput = document.getElementById('dayTitle');
    
    // Mövcud başlığı al
    const currentTitle = document.querySelector(`[onclick="editDayTitle('${day}')"]`)?.textContent?.replace('✏️', '').trim() || day;
    titleInput.value = currentTitle;
    
    modal.style.display = 'block';
    titleInput.focus();
    
    // Modal bağlandıqda gün başlığını yenilə
    modal.dataset.currentDay = day;
}

function closeEditTitleModal() {
    const modal = document.getElementById('editTitleModal');
    modal.style.display = 'none';
}

// Qeydləri yadda saxla
async function saveDayNotes(day, notes) {
    try {
        const response = await fetch(`/api/day-info/${day}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: getCurrentDayTitle(day),
                notes: notes
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showCopyNotification('Qeydlər yadda saxlanıldı!', 'success');
        }
    } catch (error) {
        console.error('Xəta:', error);
        showCopyNotification('Qeydlər yadda saxlanılmadı!', 'error');
    }
}

// Mövcud gün başlığını al
function getCurrentDayTitle(day) {
    const titleElement = document.querySelector(`[onclick="editDayTitle('${day}')"]`);
    if (titleElement) {
        return titleElement.textContent.replace('✏️', '').trim();
    }
    return day;
}

// HTML Export funksiyası
async function exportToHTML() {
    try {
        // Server-dən məlumatları al
        const response = await fetch('/api/export-data');
        const data = await response.json();
        
        if (data.success) {
            const html = createHTMLContent(data.tvPrograms, data.dayInfo);
            
            // HTML faylını yüklə
            const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'aztv-program-siyahisi.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showCopyNotification('HTML faylı yükləndi!', 'success');
        } else {
            showCopyNotification('Export xətası!', 'error');
        }
    } catch (error) {
        console.error('Export xətası:', error);
        showCopyNotification('Export xətası!', 'error');
    }
}

function createHTMLContent(tvPrograms, dayInfo) {
    const days = {
        bazarertesi: 'bazarertesi',
        cersenbe: 'cersenbe',
        carsanbe: 'carsanbe',
        cume: 'cume',
        cumeaxsami: 'cumeaxsami',
        senbe: 'senbe',
        bazar: 'bazar'
    };
    
    const css = `
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .week-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            padding: 30px;
        }
        
        .day-card {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .day-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .day-title {
            color: #667eea;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        
        .programs-list {
            margin-bottom: 20px;
        }
        
        .program-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 12px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .program-item:last-child {
            border-bottom: none;
        }
        
        .time {
            background: #667eea;
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
            min-width: 60px;
            text-align: center;
            flex-shrink: 0;
        }
        
        .program-info {
            flex: 1;
            margin-left: 15px;
        }
        
        .program-name {
            font-weight: 500;
            display: block;
            margin-bottom: 2px;
        }
        
        .program-description {
            font-size: 0.8rem;
            color: #6c757d;
            font-style: italic;
        }
        
        .day-notes {
            margin-bottom: 20px;
            padding: 15px;
            background: #e9ecef;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .day-notes h4 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 1rem;
        }
        
        .day-notes p {
            color: #495057;
            font-style: italic;
            margin: 0;
        }
        
        @media (max-width: 768px) {
            .week-grid {
                grid-template-columns: 1fr;
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .day-card {
                padding: 20px;
            }
        }
    </style>
    `;
    
    const js = `
    <script>
        // Səhifə yükləndikdə animasiya əlavə et
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.day-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    </script>
    `;
    
    const html = `<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AzTV Həftəlik Proqram Siyahısı</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    ${css}
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>AzTV Həftəlik Proqram Siyahısı</h1>
            <p>Həftənin bütün günlərinin TV proqramları</p>
        </header>

        <div class="week-grid">
            ${Object.entries(days).map(([key, dayKey]) => {
                const programs = tvPrograms[dayKey] || [];
                const dayData = dayInfo[dayKey] || { title: key, notes: '' };
                
                return `
                <div class="day-card">
                    <h3 class="day-title">${dayData.title}</h3>
                    <div class="programs-list">
                        ${programs.length > 0 ? 
                            programs.map(program => `
                                <div class="program-item">
                                    <span class="time">${program.time}</span>
                                    <div class="program-info">
                                        <span class="program-name">${program.program}</span>
                                        ${program.description ? `<span class="program-description">${program.description}</span>` : ''}
                                    </div>
                                </div>
                            `).join('') : 
                            ''
                        }
                    </div>
                    ${dayData.notes ? `
                    <div class="day-notes">
                        <p>${dayData.notes.replace(/\n/g, '<br>')}</p>
                    </div>
                    ` : ''}
                </div>
                `;
            }).join('')}
        </div>
    </div>
    ${js}
</body>
</html>`;
    
    return html;
}

// Bildiriş göstərmə
function showCopyNotification(message, type = 'success') {
    const notification = document.getElementById('copyNotification');
    const messageEl = document.getElementById('copyMessage');
    
    if (notification && messageEl) {
        messageEl.textContent = message;
        notification.className = `copy-notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    } else {
        // Fallback bildiriş
        alert(message);
    }
}

// Modal bağlama
document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close');
    const editTitleForm = document.getElementById('editTitleForm');
    
    // Modal bağla
    closeBtns.forEach(closeBtn => {
        closeBtn.onclick = function() {
            const modal = closeBtn.closest('.modal');
            modal.style.display = 'none';
        }
    });
    
    // Modal xaricində klikləndikdə bağla
    window.onclick = function(event) {
        modals.forEach(modal => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Gün başlığını yenilə
    if (editTitleForm) {
        editTitleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const modal = document.getElementById('editTitleModal');
            const day = modal.dataset.currentDay;
            const newTitle = document.getElementById('dayTitle').value.trim();
            
            if (!newTitle) {
                alert('Zəhmət olmasa başlıq daxil edin');
                return;
            }
            
            try {
                const response = await fetch(`/api/day-info/${day}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: newTitle,
                        notes: getCurrentDayNotes(day)
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Başlığı yenilə
                    const titleElement = document.querySelector(`[onclick="editDayTitle('${day}')"]`);
                    if (titleElement) {
                        titleElement.innerHTML = `${newTitle} <span class="edit-icon">✏️</span>`;
                    }
                    
                    closeEditTitleModal();
                    showCopyNotification('Başlıq yeniləndi!', 'success');
                } else {
                    alert('Xəta: ' + data.message);
                }
            } catch (error) {
                console.error('Xəta:', error);
                alert('Xəta baş verdi');
            }
        });
    }
    
    // Mövcud qeydləri al
    function getCurrentDayNotes(day) {
        const notesElement = document.querySelector(`[onblur="saveDayNotes('${day}', this.value)"]`);
        return notesElement ? notesElement.value : '';
    }
});

// Səhifə yükləndikdə animasiya
document.addEventListener('DOMContentLoaded', function() {
    // Kartlar üçün animasiya
    const cards = document.querySelectorAll('.day-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Cədvəl sətirləri üçün animasiya
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, index * 50);
    });
});

// Proqram silmə funksiyası
async function deleteProgram(day, index) {
    if (confirm('Bu proqramı silmək istədiyinizə əminsiniz?')) {
        try {
            const response = await fetch(`/api/programs/${day}/${index}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                location.reload();
            } else {
                alert('Xəta baş verdi');
            }
        } catch (error) {
            console.error('Xəta:', error);
            alert('Xəta baş verdi');
        }
    }
}

// Klaviatura qısayolları
document.addEventListener('keydown', function(e) {
    // Escape - Modal bağla
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});

// Səhifə yükləndikdə fokus idarəsi
document.addEventListener('DOMContentLoaded', function() {
    // Modal açıldıqda ilk input-a fokus
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (modal.style.display === 'block') {
                        const firstInput = modal.querySelector('input, select, textarea');
                        if (firstInput) {
                            firstInput.focus();
                        }
                    }
                }
            });
        });
        
        observer.observe(modal, { attributes: true });
    });
});
