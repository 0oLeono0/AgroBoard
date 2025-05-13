PRAGMA foreign_keys = ON;

-- Таблица пользователей с ролями и профилем
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    UNIQUE NOT NULL,
  password      TEXT    NOT NULL,
  role          TEXT    NOT NULL DEFAULT 'buyer',   -- 'farmer' или 'buyer'
  inn           TEXT,                                -- ИНН
  phone         TEXT,                                -- телефон
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Объявления (ads)
CREATE TABLE IF NOT EXISTS ads (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  title            TEXT    NOT NULL,
  description      TEXT,
  price            REAL,
  price_on_request BOOLEAN DEFAULT 0,                -- цена по запросу
  region           TEXT,
  sort             TEXT,                             -- сорт зерна
  delivery_base    TEXT,                             -- база поставки
  shipment_deadline DATE,                            -- срок отгрузки
  user_id          INTEGER NOT NULL,                 -- владелец (farmer)
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Аукционы на базе объявления
CREATE TABLE IF NOT EXISTS auctions (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  ad_id            INTEGER NOT NULL,                  -- ссыль на объявление
  start_price      REAL    NOT NULL,
  current_price    REAL,                              -- обновляется по ставкам
  start_at         DATETIME NOT NULL,                 -- время старта
  end_at           DATETIME NOT NULL,                 -- время окончания
  status           TEXT    NOT NULL DEFAULT 'open',   -- open/closed
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(ad_id) REFERENCES ads(id) ON DELETE CASCADE
);

-- Ставки по аукциону
CREATE TABLE IF NOT EXISTS bids (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  auction_id    INTEGER NOT NULL,
  user_id       INTEGER NOT NULL,                    -- кто ставит (buyer)
  amount        REAL    NOT NULL,
  placed_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(auction_id) REFERENCES auctions(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id)    REFERENCES users(id)    ON DELETE CASCADE
);

-- Сделки (deals)
CREATE TABLE IF NOT EXISTS deals (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  auction_id       INTEGER,                           -- если сделка через аукцион
  ad_id            INTEGER NOT NULL,                  -- если прямой договор
  buyer_id         INTEGER NOT NULL,                  -- покупатель
  farmer_id        INTEGER NOT NULL,                  -- продавец
  final_price      REAL    NOT NULL,                  -- итоговая цена
  volume           REAL    NOT NULL,                  -- объём сделки
  status           TEXT    NOT NULL DEFAULT 'pending_signature',  
                                                     -- pending_signature, signed, shipped, completed
  contract_path    TEXT,                              -- путь к PDF-файлу контракта
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(auction_id) REFERENCES auctions(id),
  FOREIGN KEY(ad_id)      REFERENCES ads(id)      ON DELETE CASCADE,
  FOREIGN KEY(buyer_id)   REFERENCES users(id),
  FOREIGN KEY(farmer_id)  REFERENCES users(id)
);

-- История изменений сделки
CREATE TABLE IF NOT EXISTS deal_history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  deal_id     INTEGER NOT NULL,
  status      TEXT    NOT NULL,                      -- статус на момент записи
  changed_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  note        TEXT,                                  -- дополнительная информация
  FOREIGN KEY(deal_id) REFERENCES deals(id) ON DELETE CASCADE
);
