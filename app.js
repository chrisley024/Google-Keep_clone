class App {
  constructor() {
    this.notes = [];
    this.title = '';
    this.text = '';
    this.id = '';
    this.color= '';

  this.$form = document.querySelector('#form');
  this.$noteTitle = document.querySelector('#note-title');
  this.$noteText = document.querySelector('#note-text');
  this.$notes = document.querySelector('#notes');
  this.$formCloseButton = document.querySelector('#close-btn');
  this.$formButtons = document.querySelector('#form-buttons');
  this.$placeholder = document.querySelector('#placeholder');
  this.$modal = document.querySelector('.modal');
  this.$closeBtnModal = document.querySelector('#close-btn-modal');
  this.$modalContent = document.querySelector('.modal-content');
  this.$modalTitle = document.querySelector('.modal-title');
  this.$modalText = document.querySelector('.modal-text');
  this.$colorTooltip = document.querySelector('#color-tooltip');
  this.$mainMenuImg = document.querySelector('#mainMenu-img');
  this.$sideBar = document.querySelector('#side-bar');

  this.render();
  this.addEventListeners();
}

  addEventListeners() {
    document.body.addEventListener('click', event => {
      this.handleFormClick(event);
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event)
    });

    // toggle sidebar menu
    this.$mainMenuImg.addEventListener('click', event => {
      event.preventDefault();
      this.$sideBar.classList.toggle('open-side-bar');
    })

    document.body.addEventListener('mouseover', event => {
      this.openTooltip(event);
    });

    document.body.addEventListener('mouseout', event => {
      this.closeTooltip(event);
    });

    this.$colorTooltip.addEventListener('mouseover', function() {
      this.style.display = 'flex';
    });

    this.$colorTooltip.addEventListener('mouseout', function() {
      this.style.display = 'none';
    });

    // select note color
    this.$colorTooltip.addEventListener('click', event => {
      const color = event.target.dataset.color;
      if(color) {
        this.color = color
        this.editNoteColor(color);
      }
    });

    this.$formCloseButton.addEventListener('click', event => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const hasNote = title || text;
      if (hasNote) {
        this.addNote({ title, text });
        event.stopPropagation();
        this.closeForm();
      } else {
        event.stopPropagation();
        this.closeForm();
      }
    });

    this.$closeBtnModal.addEventListener ('click', event => {
      this.closeModal(event)    
    });
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);

    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const hasNote = title || text;

    if (isFormClicked) {
      this.openForm();
    } else if(hasNote) {
      this.addNote({ title, text });   
    } else {
      this.closeForm();
    }
  }

  openForm() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$formButtons.style.display = 'block';
  }

  closeForm() {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
    this.$noteTitle.value = '';
    this.$noteText.value = '';
  }

  openModal(event) {
    if (event.target.matches('.toolbar-delete') || 
    event.target.matches('.toolbar-color')) return;

    if (event.target.closest('.note')) {
      this.$modal.classList.toggle('open-modal');
      // update modal title and text
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
      // update modal background color
      this.$modalContent.style.backgroundColor = this.color;
      this.$modalTitle.style.backgroundColor = this.color;
      this.$modalText.style.backgroundColor = this.color;
    }    
  }

  closeModal(event) {
    this.editNote();
    this.$modal.classList.toggle('open-modal');
  }

  openTooltip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    this.id = event.target.dataset.id;
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left + window.scrollX;
    const vertical = noteCoords.top + window.scrollY;
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = "flex";
  }

  closeTooltip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    this.$colorTooltip.style.display = 'none';
  }

  addNote({title, text}) {
    const newNote = {
      title,
      text,
      color: 'white',
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
    };
    this.notes = [...this.notes, newNote];
    this.render();
    this.closeForm();
  }

  editNote() {
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;
    this.notes = this.notes.map(note =>
      note.id === Number(this.id) ? {...note, title, text} : note);
      this.render();
    }

  editNoteColor(color) {
    this.notes = this.notes.map(note => 
      note.id === Number(this.id) ? {...note, color } : note);
      this.render();
    }

  selectNote(event) {
    const $selectNote = event.target.closest('.note');
    if (!$selectNote) return;
    const [$noteTitle, $noteText] = $selectNote.children;
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id = $selectNote.dataset.id;
  }

  deleteNote(event) {
    event.stopPropagation();
    if(!event.target.matches('.toolbar-delete')) return;
    const id = event.target.dataset.id;
    this.notes = this.notes.filter(note => note.id !== Number(id));
    this.render();
  }

  render() {
    this.saveNotes();
    this.displayNotes();
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes))
  }
  
  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? 'none' : 'flex';

    this.$notes.innerHTML = this.notes.map(note => `
      <div style="background: ${note.color};" class="note" data-id="${note.id}">
        <div class="${note.title && 'note-title'}">${note.title}</div>
        <div class="note-text">${note.text}</div>
        <div class="toolbar-container">
        <div class="toolbar">
          <span id="remind-me-icon">
            <a href="#">
              <img src="https://icon.now.sh/notifications_none" title="Remind me"> 
            </a>   
          </span>           
          <span id="collabo-icon">
            <a href="#">
              <img src="https://icon.now.sh/person_add" title="Collaborator"> 
            </a>   
          </span>            
          <span id="color-pallete">
            <a href="#">
              <img class="toolbar-color" src="https://icon.now.sh/palette" title="Change colour" data-id="${note.id}">   
            </a> 
          </span>            
          <span id="image-icon">
            <a href="#">
              <img src="https://icon.now.sh/photo" title="Add image"> 
            </a>   
          </span> 
          <span id="archive-icon">
            <a href="#">
              <img src="https://icon.now.sh/assignment_returned" title="Archive"> 
            </a>   
          </span>
          <span id="more-icon">
            <a href="#">
              <img src="https://icon.now.sh/more_vert" title="More"> 
            </a>   
          </span>
          <span id="toolbar-delete"> 
          <a href="#">
              <img class="toolbar-delete" src="https://icon.now.sh/delete" title="Delete" data-id="${note.id}"> 
          </a>   
          </span>
        </div>
        </div>
      </div>
    `).join('');
  }
}

new App();