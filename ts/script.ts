console.log("Всё работает хорошо!");

//Базовый класс
class Product {
  constructor(protected id: number, public name: string, public price: number, public description: string, public inStock: number) {

  }

  //Инициализация карточки
  Init(): any {
    let h5 = document.createElement("h5");
    h5.setAttribute("class", "card-title");
    h5.innerHTML = this.name;

    let divprice = document.createElement("div");
    divprice.setAttribute("class", "col-6 p-0 text-primary font-weight-bold");
    divprice.innerHTML = this.price + " грн.";

    let divavail = document.createElement("div");
    if (this.IsAvailable()) {
      divavail.setAttribute("class", "col-6 p-0 text-right text-success");
      divavail.innerHTML = "Есть в наличии";
    } else {
      divavail.setAttribute("class", "col-6 p-0 text-right text-danger");
      divavail.innerHTML = "Нет в наличии";
    }

    let divrow = document.createElement("div");
    divrow.setAttribute("class", "row");
    divrow.appendChild(divprice);
    divrow.appendChild(divavail);

    let divcon = document.createElement("div");
    divcon.setAttribute("class", "container");
    divcon.appendChild(divrow);

    let p = document.createElement("p");
    p.setAttribute("class", "card-text");
    p.innerHTML = this.description;

    let a = document.createElement("a");
    a.setAttribute("id", this.id.toString());
    a.setAttribute("href", "#buyModal");
    a.setAttribute("class", "btn btn-primary");
    a.setAttribute("data-toggle", "modal");
    a.onclick = () => WantBuy(this.id, this);
    a.innerHTML = "Купить";

    let divfu = document.createElement("div");
    divfu.setAttribute("class", "card-footer");
    divfu.appendChild(a);

    let divcardb = document.createElement("div");
    divcardb.setAttribute("class", "card-body mh-100");
    divcardb.setAttribute("style", "height: 200px");
    divcardb.appendChild(h5);
    divcardb.appendChild(divcon);
    divcardb.appendChild(p);

    let divcard = document.createElement("div");
    divcard.setAttribute("class", "card");
    divcard.appendChild(divcardb);
    divcard.appendChild(divfu);

    let divcol = document.createElement("div");
    divcol.setAttribute("class", "col-md-6 col-xl-4 p-1");
    divcol.appendChild(divcard);

    return divcol;
  }

  //Добавление карточки в строку
  protected Embed(obj: any) {
    let prods = document.getElementById('rowts');
    prods.appendChild(obj);
  }

  //Определение есть ли товар в наличии
  IsAvailable(): boolean {
    return this.inStock > 0;
  }
}

//Перечисление доступных цветов
enum Color { Black = "Чёрный", Gray = "Серый", Pink = "Розовый" };

interface Shoes {
  dimension: number; //размер
  color: Color; //цвет
  quantity: number; //количество
}

//Класс со сложными особенностями
class FeltBoots extends Product {
  isBigSizes: boolean; //Есть большие размеры
  haveColors: string[]; //Цвета которые есть
  constructor(protected id: number, public name: string, public price: number, public description: string, public inStock: number, public list?:Shoes[]) {
    super(id, name, price, description, inStock);
    this.CalculateFlags();
    this.Init();
  }

  Init() {
    let obj = super.Init();

    //Если есть большие размеры, то добавляем информацию об этом в карточку
    if (this.isBigSizes) {
      let p = document.createElement("p");
      p.setAttribute("class", "card-text text-info m-0");
      p.innerHTML = "Есть большие размеры";
      obj.firstChild.firstChild.insertBefore(p, obj.firstChild.firstChild.childNodes[2]);
    }

    //Если есть информация о цвете, то добавляем её в карточку
    if (this.haveColors.length > 0) {
      let p = document.createElement("p");
      p.setAttribute("class", "card-text text-info m-0");
      let str = this.haveColors[0];
      for (let i = 1; i < this.haveColors.length; i++) {
        str += ", " + this.haveColors[i];
      }
      p.innerHTML = "Есть цвета: " + str;
      obj.firstChild.firstChild.insertBefore(p, obj.firstChild.firstChild.childNodes[2]);
    }

    this.Embed(obj);
  }

  //Вычисление сложных особенностей
  CalculateFlags() {
    //Поиск больших размеров
    this.isBigSizes = false;
    if (this.list != null)
      for (let i = 0; i < this.list.length; i++)
        if (this.list[i].dimension > 43 && this.list[i].quantity > 0) {
          this.isBigSizes = true;
          break;
        }
    //Поиск доступных цветов
    let k = 0;
    this.haveColors = [];
    if (this.list != null)
      for (let i = 0; i < this.list.length; i++)
        if (this.haveColors.indexOf(this.list[i].color) == -1)
          this.haveColors[k++] = this.list[i].color;
  }
}

function addFilter(id: string, label: string) {
  let inp = document.createElement("input");
  inp.setAttribute("type", "checkbox");
  inp.setAttribute("class", "filter-checkbox");
  inp.setAttribute("id", id);

  let lab = document.createElement("label");
  lab.setAttribute("class", "filter-wrapper");
  lab.appendChild(inp);
  lab.innerHTML += `<div class="filter-label">` + label + `</div>`;

  let div = document.getElementById('myTools');
  div.appendChild(lab);

  document.getElementById(id).addEventListener('change', event => {
    filters[id] = (event.target as HTMLInputElement).checked
    onFilterChanged()
  });
}

//Класс с группировкой
class Headphones extends Product {
  constructor(protected id: number, public name: string, public price: number, public description: string, public inStock: number, public isWireless?: boolean) {
    super(id, name, price, description, inStock);
    this.Init();
  }

  public Init() {
    let obj = super.Init();

    //Если наушники беспроводные, то добавляем информацию об этом в карточку
    if (this.isWireless) {
      let p = document.createElement("p");
      p.setAttribute("class", "card-text text-info m-0");
      p.innerHTML = "Беспроводные";
      obj.firstChild.firstChild.insertBefore(p, obj.firstChild.firstChild.childNodes[2]);
    }

    //Если эти конкретные наушники беспроводные и нет чекбокса группировки, то добавляем его
    if (document.getElementById('isWireless') == null && this.isWireless != null && this.isWireless) {
      addFilter('isWireless', 'Только беспроводные')
    }

    this.Embed(obj);
  }
}

function onFilterChanged() {
  document.getElementById('rowts').innerHTML = "";
  productList
    .filter(p =>
      (!filters['isWireless'] || (p as Headphones).isWireless) &&
      (!filters['battery-aa'] || (p as Flashlight).batteryType === 'AA') &&
      (!filters['battery-aaa'] || (p as Flashlight).batteryType === 'AAA') &&
      (!filters['size-s'] || (p as Umbrella).size === 'S') &&
      (!filters['size-m'] || (p as Umbrella).size === 'M') &&
      (!filters['size-l'] || (p as Umbrella).size === 'L') &&
      (!filters['size-xl'] || (p as Umbrella).size === 'XL')
    )
    .forEach(p => p.Init());
}

//Класс пока не имеющий отличий от базового
class Balalaika extends Product {
  constructor(protected id: number, public name: string, public price: number, public description: string, public inStock: number) {
    super(id, name, price, description, inStock);
    this.Init();
  }

  Init() {
    this.Embed(super.Init());
  }
}

type BatteryType = 'AA' | 'AAA'
type UmbrellaSize = 'S' | 'M' | 'L' | 'XL'

class Flashlight extends Product {
  constructor(protected id: number, public name: string, public price: number, public description: string, public inStock: number, public batteryType: BatteryType, public undeadProtection: boolean) {
    super(id, name, price, description, inStock);
    this.Init();
  }

  Init() {
    let obj = super.Init();

    let p = document.createElement("p");
    p.setAttribute("class", `card-text m-0 ${this.undeadProtection ? 'text-info' : 'yellow-text'}`);
    p.innerHTML = this.undeadProtection ? "С защитой от нежити" : "Без защиты от нежити";
    obj.firstChild.firstChild.insertBefore(p, obj.firstChild.firstChild.childNodes[2]);

    let p2 = document.createElement("p");
    p2.setAttribute("class", `card-text m-0 text-info`);
    p2.innerHTML = 'Тип батарейки: ' + this.batteryType;
    obj.firstChild.firstChild.insertBefore(p2, obj.firstChild.firstChild.childNodes[3]);

    if (document.getElementById('battery-aa') == null && this.batteryType === 'AA') {
      addFilter('battery-aa', 'На батарейках АА')
    }
    if (document.getElementById('battery-aaa') == null && this.batteryType === 'AAA') {
      addFilter('battery-aaa', 'На батарейках ААA')
    }

    this.Embed(obj);
  }
}

class Umbrella extends Product {
  constructor(protected id: number, public name: string, public price: number, public description: string, public inStock: number, public size: UmbrellaSize, public armorRating: number) {
    super(id, name, price, description, inStock);
    this.Init();
  }

  Init() {
    let obj = super.Init();

    let p = document.createElement("p");
    p.setAttribute("class", "card-text text-info m-0 d-flex");

    let armorSquares = ''
    for (let i = 0; i < this.armorRating; i += 10) {
      armorSquares += `<div class="armor-square"></div>`
    }

    p.innerHTML = "Уровень брони: " + `<div class="mx-2 d-flex align-items-center">` + armorSquares + `</div>`;
    obj.firstChild.firstChild.insertBefore(p, obj.firstChild.firstChild.childNodes[2]);

    let p2 = document.createElement("p");
    p2.setAttribute("class", `card-text m-0 text-info`);
    p2.innerHTML = 'Зонтогабариты: ' + this.size;
    obj.firstChild.firstChild.insertBefore(p2, obj.firstChild.firstChild.childNodes[3]);

    if (document.getElementById('size-s') == null && this.size === 'S') {
      addFilter('size-s', 'Размер S')
    }
    if (document.getElementById('size-m') == null && this.size === 'M') {
      addFilter('size-m', 'Размер M')
    }
    if (document.getElementById('size-l') == null && this.size === 'L') {
      addFilter('size-l', 'Размер L')
    }
    if (document.getElementById('size-xl') == null && this.size === 'XL') {
      addFilter('size-xl', 'Размер XL')
    }

    this.Embed(obj);
  }
}

interface BasketRecord {
  id: number; //id товара
  quantity: number; //Его количество
}

class Basket {
  private list: BasketRecord[] = []; //Список товаров в корзине

  constructor() {

  }

  //Добавить товар в корзину. Возвращает результат операции
  Add(val: number): boolean {
    let num = +(<HTMLInputElement>document.getElementById('inputquantity')).value;

    //Проверка введенного количества товара. Если ввели ерунду, то выводится сообщение об ошибке. Иначе товар добавляется в корзину
    if (isNaN(num) || !((num ^ 0) === num) || num == 0 || productList[val].inStock < num) {
      if (productList[val].inStock < num) document.getElementById('modlalMessag').innerHTML = "Столько на складе нет";
      else document.getElementById('modlalMessag').innerHTML = "Введите целое число";
      return false;
    }
    else {
      document.getElementById('modlalMessag').innerHTML = "";
      productList[val].inStock -= num;
      this.list[this.list.length] = { id: val, quantity: num };
      this.CalculateBasket();
      return true;
    }
  }

  //Пересчитать товары в корзине
  CalculateBasket() {

    let itemsById: {[key: number]: BasketRecord} = {}
    this.list.forEach(i => {
      if (itemsById[i.id]) {
        itemsById[i.id].quantity += i.quantity
      } else {
        itemsById[i.id] = i
      }
    })
    let mergedList = Object.values(itemsById)

    if (mergedList.length > 0) {
      let id;
      let total: number = 0;
      let message: string = "В даннвй момент в корзине:<br>";
      for (let i = 0; i < mergedList.length; i++) {
        message += productList[mergedList[i].id].name + " - " + mergedList[i].quantity + "<br>";
        total += productList[mergedList[i].id].price * mergedList[i].quantity;
      }
      message += "<br><br>На общую сумму " + total + " грн.";

      document.getElementById('myBasket').innerHTML = message;
    }
    else document.getElementById('myBasket').innerHTML = "В данный момент корзина пустая";
  }
}

//Действие на кнопке "добавить в корзину"
function myByBtn(val: any) {
  // @ts-ignore
  if (basket.Add(val)) $('#buyModal').modal('hide');
}

//Действие на кнопке "купить"
function WantBuy(id: any, product: Product) {
  document.getElementById('modlalBtn').setAttribute("value", id);
  document.getElementById('in-stock-label').innerHTML = String(product.inStock);
}

let filters: {[key: string]: boolean} = {}
//Инициализация корзины
let basket: Basket = new Basket();
//Список продуктов
let productList: Product[] = [
  new Headphones(0, "Наушники фирмы1", 816, "Прекрасные наушники! Сама английская королева слушает жесткий металл через такие же!", 4, true),
  new FeltBoots(1, "Валенки2", 91.2, "Хороший выбор! В них тепло, хорошо. Обувь многосезонная - лето, осень, зима, весна.", 6,
    [{ dimension: 44, color: Color.Black, quantity: 2 },
      { dimension: 43, color: Color.Black, quantity: 3 },
      { dimension: 42, color: Color.Black, quantity: 1 },
      { dimension: 41, color: Color.Black, quantity: 2 },
      { dimension: 44, color: Color.Gray, quantity: 2 },
      { dimension: 39, color: Color.Gray, quantity: 1 },
      { dimension: 45, color: Color.Gray, quantity: 1 },
      { dimension: 42, color: Color.Gray, quantity: 1 },
    ]),
  new Headphones(2, "Наушники фирмы4", 119.50, "Дёшево не значит плохо! Эти наушники стоят своих денег!", 30, false),
  new Headphones(3, "Наушники фирмы2", 144, "Это оптимальный выбор! Налетай торопись!", 15, true),
  new Balalaika(4, "Балалайка1", 915, "Сам страдивари её выстругал! Мастер Страдивари Аарон Моисеевич ©. В комплекте к балалайке должен идти медведь.", 1),
  new FeltBoots(5, "Валенки3", 65, "Валенки знаменитой российской фабрики Красный ЦинБаоЧен. Оригинальный продукт сделаный по технологиям прошлого.", 1),
  new Headphones(6, "Наушники фирмы3", 265, "Тру поклонники музыки обязательно такие имеют! А ты что? Ты не тру?!", 0),
  new FeltBoots(7, "Валенки1", 666.66, "Валенки великолепной работы слепого мастера Игната! В комплекте к валенкам идёт кокошник.", 2,
    [{ dimension: 45, color: Color.Pink, quantity: 1 },
      { dimension: 43, color: Color.Pink, quantity: 1 }
    ]),
  new Balalaika(8, "Балалайка2", 217, "Обычная балалайка белорусской фирмы Змрочныя мелодыі.", 1),
  new Flashlight(9, "Фонарик ЯсенСвет", 199, "Освещает помещение, отгоняет нежить.", 50, 'AA', true),
  new Flashlight(10, "Фонарик Светлячок", 120, "Когда просто нужно немного света", 300, 'AAA', false),
  new Umbrella(11, "Зонт Каплипрочь", 40.25, "Отталкивает воду и собеседников. Умеренное бронирование", 73, 'L', 20),
  new Umbrella(12, "Зонт Панцирь", 350, "Броня в виде зонта. Мощная защита.", 385, 'XL', 70),
];

