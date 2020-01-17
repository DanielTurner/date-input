import { html, css, LitElement } from 'lit-element';

/**
 * DateInputWrapper
 * @extends LitElement
 */
export class DateInputWrapper extends LitElement {
  /**
   */
  constructor() {
    super();
    const date = new Date();
    this.setToday();
    this.minYear = (date.getFullYear() - 5).toString();
    this.maxYear = (date.getFullYear() + 5).toString();
    this.open = false;
    this.months = [
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

    this.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.format = {
      locales: 'en-US',
      options: {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    };
    this.instance = '';
  }

  /**
   *
   */
  static get properties() {
    return {
      date: {
        type: String,
      },

      days: {
        type: Array,
      },

      instance: {
        type: String,
      },

      maxYear: {
        type: String,
      },

      minYear: {
        type: String,
      },

      months: {
        type: Array,
      },

      open: {
        type: Boolean,
        reflect: true,
      },

      selectedDate: {
        type: String,
      },

      selectedDay: {
        type: String,
      },

      selectedMonth: {
        type: String,
      },

      selectedYear: {
        type: String,
      },

      value: {
        type: Number,
      },

      format: {
        type: Object,
      },
    };
  }

  /**
   *
   */
  firstUpdated() {
    const input = this.shadowRoot.querySelector('slot').assignedElements()[0];
    input.addEventListener('click', (e) => this.togglePicker(true, e));
    input.addEventListener('keydown', (e) => {
      e.preventDefault();
    });
    window.addEventListener('closeDateInput',
        (e) => this.togglePicker(false, e));
  }

  /**
   */
  setToday() {
    const date = new Date();
    const thisMonth = (date.getMonth() + 1).toString();
    const thisDay = date.getDate().toString();
    this.selectedMonth = thisMonth;
    this.selectedYear = date.getFullYear().toString();
    this.selectedDay = thisDay;
    const selectedYearIndex = date.getFullYear() - Number(this.minYear);
    const selectedMonthIndex = Number(this.selectedMonth);
    this.updateSelectedDate(
        this.selectedDay,
        this.selectedMonth,
        this.selectedYear,
    );
    this.updateDropdowns(selectedYearIndex, selectedMonthIndex);
  }

  /**
   * @param {Number} selectedYearIndex
   * @param {Number} selectedMonthIndex
   */
  updateDropdowns(selectedYearIndex, selectedMonthIndex) {
    const monthSelector = this.shadowRoot.querySelector('#month');
    const yearSelector = this.shadowRoot.querySelector('#year');
    if (monthSelector && yearSelector) {
      monthSelector.value = selectedMonthIndex;
      yearSelector.selectedIndex = selectedYearIndex;
    }
  }

  /**
   * @param {*} param0
   */
  selectMonth({ target: { value } }) {
    this.selectedMonth = value;
  }

  /**
   *
   * @param {*} param0
   */
  selectYear({ target: { value } }) {
    this.selectedYear = value;
  }

  /**
   * @return {Number}
   */
  daysInMonth() {
    return 32 - new Date(this.selectedYear, this.selectedMonth, 32).getDate();
  }

  /**
   * @return {TemplateResult}
   */
  renderMonthSelect() {
    const initialMonth = this.months[new Date().getMonth()];

    const selections = this.months.map(
        (month, index) => html`
            <option
              ?selected=${month === initialMonth} value=${index + 1}>
              ${month}
            </option>`,
    );

    return html`
      <select @input=${this.selectMonth} id="month" name="month">
        ${selections}
      </select>
    `;
  }

  /**
   * @return {TemplateResult}
   */
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

  /**
   * @return {TemplateResult}
   */
  renderDayTable() {
    const tmpDate = new Date(this.selectedYear, this.selectedMonth, 0);
    // eslint-disable-next-line no-unused-vars
    const num = this.daysInMonth();
    // eslint-disable-next-line no-unused-vars
    const dayOfWeek = tmpDate.getDay();
    const firstDay = new Date(this.selectedYear, this.selectedMonth).getDay();
    const displayDays = this.days.map((day) => html`<th>${day}</th>`);
    const rows = [];
    let date = 1;
    for (let i = 0; i < 6; i += 1) {
      const rowDays = [];
      for (let j = 0; j < 7; j += 1) {
        if (i === 0 && j < firstDay) {
          rowDays.push(
              html`
              <td></td>
            `,
          );
        } else if (date > this.daysInMonth()) {
          break;
        } else {
          rowDays.push(
              html`
              <td id=${date} @click=${this.selectDate}>${date}</td>
            `,
          );
          date += 1;
        }
      }
      rows.push(
          html`
          <tr>
            ${rowDays}
          </tr>
        `,
      );
    }
    return html`
      <table>
        <thead>
          <tr>
            ${displayDays}
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }

  /**
   * @param {*} param0
   */
  selectDate({ target: { id } }) {
    this.selectedDay = id;
    this.updateSelectedDate(
        this.selectedDay,
        this.selectedMonth,
        this.selectedYear,
    );
    this.togglePicker(false);
  }

  /**
   */
  previousMonth() {
    if (Number(this.selectedMonth) === 1) {
      if (Number(this.selectedYear === this.minYear)) return;
      this.selectedMonth = String(12);
      this.selectedYear = String(Number(this.selectedYear) - 1);
      this.selectedDay = 1;
    } else {
      this.selectedMonth = String(Number(this.selectedMonth) - 1);
    }
    const yearIndex = Number(this.selectedYear) - this.minYear;
    this.updateDropdowns(yearIndex, this.selectedMonth);
  }

  /**
   */
  nextMonth() {
    if (Number(this.selectedMonth) === 12) {
      if (Number(this.selectedYear === this.maxYear)) return;
      this.selectedMonth = String(1);
      this.selectedYear = String(Number(this.selectedYear) + 1);
      this.selectedDay = 1;
    } else {
      this.selectedMonth = String(Number(this.selectedMonth) + 1);
    }
    const yearIndex = Number(this.selectedYear) - this.minYear;
    this.updateDropdowns(yearIndex, this.selectedMonth);
  }

  /**
   * @param {String} day
   * @param {String} month
   * @param {String} year
   */
  updateSelectedDate(day, month, year) {
    const displayDay = Number(day) > 9
      ? day
      : `0${day}`;
    const displayMonth = month > 9
      ? month
      : `0${month}`;
    const displayYear = year;

    const slot = this.shadowRoot.querySelector('slot');
    if (slot) {
      const date = new Date(`${displayYear}-${displayMonth}-${displayDay}`);
      const timestamp = date.getTime() / 1000;

      slot.assignedElements()[0].value = new Intl.DateTimeFormat(
          this.format.locales,
          this.format.options,
      ).format(date);

      slot.assignedElements()[0].setAttribute('data-timestamp', timestamp);
      slot.assignedElements()[0]
          .dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  /**
   * @return {TempalteResult}
   */
  render() {
    return html`
      <slot name="date"></slot>
      <div id="picker">
        <button
          class="sprite previous"
          @click="${this.previousMonth}">
        </button>
        <button
          class="sprite home"
          @click="${this.setToday}"></button>
        ${this.renderMonthSelect()} ${this.renderYearSelect()}
        <button
          class="sprite next"
          @click="${this.nextMonth}">
        </button>
        ${this.renderDayTable()}
      </div>
    `;
  }

  /**
   * @param {Boolean} open
   * @param {Event} e
   */
  togglePicker(open, e) {
    if (e) e.stopPropagation();
    this.open = open;
  }

  /**
   * @return {CSSResult}
   */
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        font: var(--picker-font, 'Arial');
      }
      :host([open]) #picker {
        display: flex;
      }
      #picker {
        width: 100%;
        max-width: 250px;
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
        z-index: 1;
      }
      table {
        background-color: var(--calendar-background, #F2F2F2);
        border-collapse: collapse;
        border-width: var(--calendar-borderwidth, 1px);
        border-style: var(--calendar-borderstyle, solid);
        border-color: var(--calendar-border-color, #808080);
        width: 100%;
      }
      thead {
        background-color: var(--day-background, #EDEDED);
      }
      th {
        color: var(--day-foreground, #333333);
        font-size: var(--day-fontsize, 14px);
        border-width: var(--calendar-borderwidth, 1px);
        border-style: var(--calendar-borderstyle, solid);
        border-color: var(--calendar-border-color, #808080);
      }
      td {
        background-color: var(--date-background);
        color: var(--date--foreground, 333333);
        font-size: var(--date-fontsize, 14px);
        border-width: var(--calendar-borderwidth, 1px);
        border-style: var(--calendar-borderstyle, solid);
        border-color: var(--calendar-border-color, #808080);
      }
      select {
        background-color: transparent;
        border: 0;
      }
      td,
      th {
        text-align: center;
      }
      .sprite {
        opacity: var(--sprite-opacity, 0.5);
        height: 25px;
        width: 25px;
        cursor: pointer;
        background-color: transparent;
        border: 0;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAeCAYAAADaW7vzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0NBRjI1NjM0M0UwMTFFNDk4NkFGMzJFQkQzQjEwRUIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0NBRjI1NjQ0M0UwMTFFNDk4NkFGMzJFQkQzQjEwRUIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDQ0FGMjU2MTQzRTAxMUU0OTg2QUYzMkVCRDNCMTBFQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDQ0FGMjU2MjQzRTAxMUU0OTg2QUYzMkVCRDNCMTBFQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoNEP54AAAIOSURBVHja7Jq9TsMwEMcxrZD4WpBYeKUCe+kTMCACHZh4BFfHO/AAIHZGFhYkBBsSEqxsLCAgXKhbXYOTxh9pfJVP+qutnZ5s/5Lz2Y5I03QhWji2GIcgAokWgfCxNvcOCCGKqiSqhUp0laHOne05vdEyGMfkdxJDVjgwDlEQgYQBgx+ULJaWSXXS6r/ER5FBVR8VfGftTKcITNs+a1XpcFoExREIDF14AVIFxgQUS+h520cdud6wNkC0UBw6BCO/HoCYwBhD8QCkQ/x1mwDyD4plh4D6DDV0TAGyo4HcawLIBBSLDkHeH0Mg2yVP3l4TQMZQDDsEOl/MgHQqhMNuE0D+oBh0CIr8MAKyazBH9WyBuKxDWgbXfjNf32TZ1KWm/Ap1oSk/R53UtQ5xTh3LUlMmT8gt6g51Q9p+SobxgJQ/qmsfZhWywGFSl0yBjCLJCMgXail3b7+rumdVJ2YRss4cN+r6qAHDkPWjPjdJCF4n9RmAD/V9A/Wp4NQassDjwlB6XBiCxcJQWmZZb8THFilfy/lfrTvLghq2TqTHrRMTKNJ0sIhdo15RT+RpyWwFdY96UZ/LdQKBGjcXpcc1AlSFEfLmouD+1knuxBDUVrvOBmoOC/rEcN7OQxKVeJTCiAdUzUJhA2Oez9QTkp72OTVcxDcXY8iKNkxGAJXmJCOQwOa6dhyXsOa6XwEGAKdeb5ET3rQdAAAAAElFTkSuQmCC);
      }
      .home {
        background-position: -70px 0;
      }
      .previous {
        background-position: -20px 0;
      }
      .next {
        background-position: 0 0;
      }
    `;
  }
}
