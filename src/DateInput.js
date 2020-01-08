import { html, css, LitElement } from 'lit-element';

export class DateInputWrapper extends LitElement {
  constructor() {
    super();
    const date = new Date();
    const thisYear = date.getFullYear().toString();
    const thisMonth = (date.getMonth() + 1).toString();
    const thisDay = date.getDate().toString();
    this.minYear = '1970';
    this.maxYear = thisYear;
    this.selectedMonth = thisMonth;
    this.selectedYear = thisYear;
    this.selectedDay = thisDay;
    this.selectedDate = `${('0' + thisDay).slice(-2)}-${(
      '0'
      + (Number(thisMonth) + 1)
    ).slice(-2)}-${thisYear}`;
    this.open = false;
  }
  static get properties() {
    return {
      date: { type: String },
      minYear: { type: String },
      maxYear: { type: String },
      selectedMonth: { type: String },
      selectedYear: { type: String },
      selectedDay: { type: String },
      selectedDate: { type: String },
      open: { type: Boolean, reflect: true },
    };
  }

  firstUpdated() {
    const input = this.shadowRoot.querySelector('slot').assignedElements()[0];
    input.addEventListener('click', (e) => this.togglePicker(true, e));
    input.addEventListener('keydown', (e) => {
      e.preventDefault();
    });
    input.setAttribute('pattern', '\\d{2}-\\d{2}-\\d{4}');
    console.log(input);
  }
  selectMonth({ target: { value } }) {
    this.selectedMonth = value;
  }
  selectYear({ target: { value } }) {
    this.selectedYear = value;
  }
  daysInMonth() {
    return 32 - new Date(this.selectedYear, this.selectedMonth, 32).getDate();
  }
  renderMonthSelect() {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const initialMonth = months[new Date().getMonth()];
    return html`
      <select @input=${this.selectMonth} id="month" name="month">
        ${months.map(
          (month, index) => html`
            <option ?selected=${month === initialMonth} value=${index}>
              ${month}
            </option>
          `
        )}
      </select>
    `;
  }
  renderYearSelect() {
    const initialYear = new Date().getFullYear();
    const min = Number(this.minYear);
    const max = Number(this.maxYear);
    const years = [];
    for (let i = min; i <= max; i += 1) {
      years.push(html`
        <option ?selected=${i === initialYear} value=${i}>${i}</option>
      `);
    }
    return html`
      <select @input=${this.selectYear} id="year" name="year">
        ${years}
      </select>
    `;
  }
  renderDayTable() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const tmpDate = new Date(this.selectedYear, this.selectedMonth, 0);
    const num = this.daysInMonth();
    const dayOfWeek = tmpDate.getDay();
    const firstDay = new Date(this.selectedYear, this.selectedMonth).getDay();
    console.log('tmpDate', tmpDate, 'num', num, 'dayOfWeek', dayOfWeek);
    const rows = [];
    let date = 1;
    for (let i = 0; i < 6; i += 1) {
      const rowDays = [];
      for (let j = 0; j < 7; j += 1) {
        if (i === 0 && j < firstDay) {
          rowDays.push(
            html`
              <td></td>
            `
          );
        } else if (date > this.daysInMonth()) {
          break;
        } else {
          rowDays.push(
            html`
              <td id=${date} @click=${this.selectDate}>${date}</td>
            `
          );
          date += 1;
        }
      }
      rows.push(
        html`
          <tr>
            ${rowDays}
          </tr>
        `
      );
    }
    return html`
      <table>
        <thead>
          <tr>
            ${days.map(
              (day) => html`
                <th>${day}</th>
              `
            )}
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }
  selectDate({ target: { id } }) {
    this.selectedDay = id;
    this.selectedDate = `${('0' + this.selectedDay).slice(-2)}-${(
      '0'
      + (Number(this.selectedMonth) + 1)
    ).slice(-2)}-${this.selectedYear}`;
    this.shadowRoot
      .querySelector('slot')
      .assignedElements()[0].value = this.selectedDate;
    this.togglePicker(false);
  }
  render() {
    return html`
      <slot name="date"></slot>
      <div id="picker">
        ${this.renderMonthSelect()} ${this.renderYearSelect()}
        ${this.renderDayTable()}
      </div>
    `;
  }
  togglePicker(open, e) {
    if (e) e.stopPropagation();
    this.open = open;
  }
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }
      :host([open]) #picker {
        display: flex;
      }
      #picker {
        width: 100%;
        max-width: 320px;
        background-color: #fff;
        position: absolute;
        top: calc(100% + 0.25rem);
        left: 0;
        display: none;
        justify-content: space-between;
        flex-wrap: wrap;
        box-sizing: border-box;
        padding: 0.5rem;
        border: 1px solid #000;
      }
      select {
        width: calc(50% - 1rem);
      }
      table {
        width: 100%;
      }
      td,
      th {
        text-align: center;
      }
    `;
  }
}