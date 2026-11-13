const mdElement = document.getElementById('markdown-content')!;

window.addEventListener('get-markdown', (e: any) => {
  mdElement.innerHTML = e.detail;
});