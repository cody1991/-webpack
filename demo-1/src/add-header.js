export default function addHeader() {
  const header = document.createElement('div');
  header.innerHTML = 'header';
  header.addEventListener('click', () => console.log('header'));
  return header;
}
