'use strict';

const now = new Date();
const date = now.toISOString().split('T')[0];
const time = now.toTimeString().split(' ')[0];
document.getElementById('dt').textContent = `${date} ${time}`;
