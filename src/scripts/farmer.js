/**
 * Manages farmer profile functionality: ads, catalog, auctions, deals, and navigation.
 * Optimized for visual demonstration with simulated real-time bids and auction protocol.
 * Stops bid simulation after auction ends.
 * Removes ad from list after auction creation without transferring to auction section.
 * Adds deal confirmation with PDF generation and status tracking with comments.
 * Separates farmer's ads (personal) and catalog ads (general, from multiple farmers).
 * Adds placeholder for empty auction section and correct status handling.
 */
import { openModal, closeModal } from "./modal.js";
import { addPopupOpenListener } from "./popup.js";
import aucIcon from "../images/auc.svg";
import delIcon from "../images/delete.svg";
import editIcon from "../images/edit.svg";

export const initFarmer = () => {
  const adsBtn = document.querySelector(".ads__btn");
  const adsPopup = document.querySelector(".popup_type_ads");
  const adsList = document.querySelector(".ads .ads__list");
  const catalogList = document.querySelector(".catalog .ads__list");
  const aucPopup = document.querySelector(".popup_type_auc");
  const editPopup = document.querySelector(".popup_type_edit");
  const deletePopup = document.querySelector(".popup_type_delete");

  if (
    !adsBtn ||
    !adsPopup ||
    !adsList ||
    !catalogList ||
    !aucPopup ||
    !editPopup ||
    !deletePopup
  ) {
    console.warn("One or more required elements are missing in profile.html");
  }

  // Personal ads for the current farmer
  let farmerAds = [
    {
      id: "ad-1",
      culture: "Пшеница",
      sort: "Луговая",
      addres: "Казахстан",
      price: "10000",
      value: "6",
      shipment: "2025-05-20",
      description: "Высококачественная пшеница",
      farmerId: "farmer-1",
    },
    {
      id: "ad-2",
      culture: "Рожь",
      sort: "Степная",
      addres: "Россия, Волгоград",
      price: "8500",
      value: "10",
      shipment: "2025-06-01",
      description: "Рожь для хлебопечения",
      farmerId: "farmer-1",
    },
    {
      id: "ad-3",
      culture: "Ячмень",
      sort: "Золотой",
      addres: "Россия, Краснодар",
      price: "9000",
      value: "8",
      shipment: "2025-05-25",
      description: "Ячмень кормовой",
      farmerId: "farmer-1",
    },
    {
      id: "ad-4",
      culture: "Кукуруза",
      sort: "Сахарная",
      addres: "Россия, Ростов",
      price: "12000",
      value: "12",
      shipment: "2025-06-10",
      description: "Кукуруза для переработки",
      farmerId: "farmer-1",
    },
  ];

  // General catalog ads (from multiple farmers)
  let catalogAds = [
    {
      id: "ad-1",
      culture: "Пшеница",
      sort: "Луговая",
      addres: "Казахстан",
      price: "10000",
      value: "6",
      shipment: "2025-05-20",
      description: "Высококачественная пшеница",
      farmerId: "farmer-1",
    },
    {
      id: "ad-2",
      culture: "Рожь",
      sort: "Степная",
      addres: "Россия, Волгоград",
      price: "8500",
      value: "10",
      shipment: "2025-06-01",
      description: "Рожь для хлебопечения",
      farmerId: "farmer-1",
    },
    {
      id: "ad-3",
      culture: "Ячмень",
      sort: "Золотой",
      addres: "Россия, Краснодар",
      price: "9000",
      value: "8",
      shipment: "2025-05-25",
      description: "Ячмень кормовой",
      farmerId: "farmer-1",
    },
    {
      id: "ad-4",
      culture: "Кукуруза",
      sort: "Сахарная",
      addres: "Россия, Ростов",
      price: "12000",
      value: "12",
      shipment: "2025-06-10",
      description: "Кукуруза для переработки",
      farmerId: "farmer-1",
    },
    {
      id: "ad-5",
      culture: "Пшеница",
      sort: "Озимая",
      addres: "Украина",
      price: "11000",
      value: "5",
      shipment: "2025-05-30",
      description: "Пшеница твердых сортов",
      farmerId: "farmer-2",
    },
    {
      id: "ad-6",
      culture: "Овёс",
      sort: "Белый",
      addres: "Беларусь",
      price: "7000",
      value: "7",
      shipment: "2025-05-28",
      description: "Овёс для корма",
      farmerId: "farmer-3",
    },
    {
      id: "ad-7",
      culture: "Гречиха",
      sort: "Алтайская",
      addres: "Россия, Алтай",
      price: "15000",
      value: "4",
      shipment: "2025-06-05",
      description: "Гречиха для крупы",
      farmerId: "farmer-4",
    },
    {
      id: "ad-8",
      culture: "Соя",
      sort: "Ранняя",
      addres: "Россия, Амур",
      price: "18000",
      value: "3",
      shipment: "2025-06-15",
      description: "Соя для экспорта",
      farmerId: "farmer-5",
    },
    {
      id: "ad-9",
      culture: "Подсолнечник",
      sort: "Масличный",
      addres: "Россия, Саратов",
      price: "20000",
      value: "5",
      shipment: "2025-06-20",
      description: "Подсолнечник для масла",
      farmerId: "farmer-6",
    },
  ];

  // Render initial ads and catalog
  renderAdsList();
  renderCatalogList();

  // Open new ad popup
  addPopupOpenListener(adsBtn, adsPopup);

  // Handle ad creation
  const adsForm = document.forms["ads"];
  adsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(adsForm);
    const adData = {
      id: `ad-${Date.now()}`, // Unique ID
      culture: formData.get("culture"),
      sort: formData.get("sort"),
      value: formData.get("value"),
      price: formData.get("price"),
      addres: formData.get("addres"),
      shipment: formData.get("shipment"),
      description: formData.get("description"),
      farmerId: "farmer-1", // Current farmer
    };
    farmerAds.push(adData);
    catalogAds.push(adData);
    renderAdsList();
    renderCatalogList();
    alert("Объявление добавлено в общий каталог!");
    closeModal(adsPopup);
  });

  // Handle ad editing, deletion, and auction creation
  adsList.addEventListener("click", (event) => {
    const btn = event.target.closest(
      ".ads__edit-btn, .ads__archive-btn, .ads__auction-btn"
    );
    if (!btn) return;
    const adItem = btn.closest(".ads__item");
    const adId = adItem.dataset.id;
    const adData = farmerAds.find((ad) => ad.id === adId);

    if (btn.classList.contains("ads__edit-btn")) {
      populateEditForm(adData);
      openModal(editPopup);
      handleEditForm(adId, editPopup);
    } else if (btn.classList.contains("ads__archive-btn")) {
      openModal(deletePopup);
      handleDeleteForm(adId, deletePopup);
    } else if (btn.classList.contains("ads__auction-btn")) {
      startAuction(adId, adData);
    }
  });

  // Navigation, deliveries, and auction logic
  initNavigation();
  initDeliveries();
  initAuction();

  // Helper functions for rendering
  function renderAdsList() {
    const header = adsList.querySelector(".ads__list-header");
    adsList.innerHTML = "";
    adsList.appendChild(header);
    farmerAds.forEach((ad) => {
      const newAd = document.createElement("li");
      newAd.classList.add("ads__item");
      newAd.dataset.id = ad.id;
      newAd.innerHTML = `
        <span class="ads__ad">${ad.culture}</span>
        <span class="ads__ad">${ad.sort}</span>
        <span class="ads__ad">${ad.addres}</span>
        <span class="ads__ad">${ad.price}</span>
        <span class="ads__ad">${ad.value}</span>
        <span class="ads__ad">${ad.shipment}</span>
        <span class="ads__ad">${ad.description}</span>
        <span class="ads__ad ads__edit-btn"><img style="width: 25px;" src="${editIcon}" alt=""></span>
        <span class="ads__ad ads__archive-btn"><img style="width: 25px;" src="${delIcon}" alt=""></span>
        <span class="ads__ad ads__auction-btn"><img style="width: 25px;" src="${aucIcon}" alt=""></span>
      `;
      adsList.appendChild(newAd);
    });
  }

  function renderCatalogList() {
    const header = catalogList.querySelector(".ads__list-header");
    catalogList.innerHTML = "";
    catalogList.appendChild(header);
    catalogAds.forEach((ad) => {
      const newAd = document.createElement("li");
      newAd.classList.add("ads__item");
      newAd.dataset.id = ad.id;
      newAd.innerHTML = `
        <span class="ads__ad">${ad.culture}</span>
        <span class="ads__ad">${ad.sort}</span>
        <span class="ads__ad">${ad.addres}</span>
        <span class="ads__ad">${ad.price}</span>
        <span class="ads__ad">${ad.value}</span>
        <span class="ads__ad">${ad.shipment}</span>
        <span class="ads__ad">${ad.description}</span>
      `;
      catalogList.appendChild(newAd);
    });
  }

  function populateEditForm(adData) {
    document.querySelector("#culture-edit-input").value = adData.culture;
    document.querySelector("#sort-edit-input").value = adData.sort;
    document.querySelector("#value-edit-input").value = adData.value;
    document.querySelector("#price-edit-input").value = adData.price;
    document.querySelector("#addres-edit-input").value = adData.addres;
    document.querySelector("#shipment-edit-input").value = adData.shipment;
    document.querySelector("#description-edit-input").value =
      adData.description;
  }

  function handleEditForm(adId, editPopup) {
    const editForm = editPopup.querySelector("form");
    const submitHandler = (e) => {
      e.preventDefault();
      const updatedAd = {
        id: adId,
        culture: document.querySelector("#culture-edit-input").value,
        sort: document.querySelector("#sort-edit-input").value,
        value: document.querySelector("#value-edit-input").value,
        price: document.querySelector("#price-edit-input").value,
        addres: document.querySelector("#addres-edit-input").value,
        shipment: document.querySelector("#shipment-edit-input").value,
        description: document.querySelector("#description-edit-input").value,
        farmerId: "farmer-1",
      };
      farmerAds = farmerAds.map((ad) => (ad.id === adId ? updatedAd : ad));
      catalogAds = catalogAds.map((ad) => (ad.id === adId ? updatedAd : ad));
      renderAdsList();
      renderCatalogList();
      closeModal(editPopup);
      editForm.removeEventListener("submit", submitHandler);
    };
    editForm.addEventListener("submit", submitHandler);
  }

  function handleDeleteForm(adId, deletePopup) {
    const deleteForm = deletePopup.querySelector("form");
    const submitHandler = (e) => {
      e.preventDefault();
      farmerAds = farmerAds.filter((ad) => ad.id !== adId);
      catalogAds = catalogAds.filter((ad) => ad.id !== adId);
      renderAdsList();
      renderCatalogList();
      closeModal(deletePopup);
      deleteForm.removeEventListener("submit", submitHandler);
    };
    deleteForm.addEventListener("submit", submitHandler);
  }

  function startAuction(adId, adData) {
    const aucPopup = document.querySelector(".popup_type_auc");
    document.querySelector("#start-price-input").value = adData.price;
    document.querySelector("#duration-input").value = 24;
    openModal(aucPopup);

    const aucForm = aucPopup.querySelector("form");
    const submitHandler = (e) => {
      e.preventDefault();
      const startPrice = document.querySelector("#start-price-input").value;
      const duration = document.querySelector("#duration-input").value;

      if (duration < 24) {
        alert("Длительность аукциона должна быть не менее 24 часов.");
        return;
      }

      // Удаляем объявление из списков
      farmerAds = farmerAds.filter((ad) => ad.id !== adId);
      catalogAds = catalogAds.filter((ad) => ad.id !== adId);
      renderAdsList();
      renderCatalogList();

      // Скрываем заглушку, показываем элементы аукциона
      const placeholder = document.querySelector(".auction-placeholder");
      const auctionDetails = document.querySelector(".auction-details");
      const startAuctionBtn = document.querySelector(".start-auction-btn");
      const auctionStatus = document.querySelector("#auction-status");
      const lotDetails = document.querySelector("#lot-details");
      const startPriceEl = document.querySelector("#start-price");
      const auctionTimer = document.querySelector("#auction-timer");

      if (placeholder) placeholder.style.display = "none";
      if (auctionDetails) auctionDetails.style.display = "block";
      if (startAuctionBtn) startAuctionBtn.style.display = "block";
      if (auctionStatus) auctionStatus.style.display = "inline";
      if (lotDetails) lotDetails.style.display = "inline";
      if (startPriceEl) startPriceEl.style.display = "inline";
      if (auctionTimer) auctionTimer.style.display = "inline";

      // Обновляем детали аукциона
      if (lotDetails) {
        lotDetails.textContent = `${adData.culture}, ${adData.sort}, ${adData.value} тонн, ${adData.addres}`;
      } else {
        console.warn("Element #lot-details not found");
      }
      if (startPriceEl) {
        startPriceEl.textContent = `${parseInt(startPrice).toLocaleString()} ₽`;
      } else {
        console.warn("Element #start-price not found");
      }
      if (auctionStatus) {
        auctionStatus.textContent = "Аукцион создан, нажмите 'Начать аукцион'";
      } else {
        console.warn("Element #auction-status not found");
      }
      if (auctionTimer) {
        auctionTimer.textContent = "Ожидает запуска";
      } else {
        console.warn("Element #auction-timer not found");
      }

      closeModal(aucPopup);
      aucForm.removeEventListener("submit", submitHandler);
    };
    aucForm.addEventListener("submit", submitHandler);
  }
};

// Navigation
const initNavigation = () => {
  const sections = {
    catalog: { link: ".header__link-catalog", section: ".catalog" },
    ads: { link: ".header__link-ads", section: ".ads" },
    auc: { link: ".header__link-auc", section: ".auc" },
    deals: { link: ".header__link-deals", section: ".deals" },
    profile: { link: ".header__link-profile", section: ".profile" },
  };

  Object.values(sections).forEach(({ link, section }) => {
    const linkEl = document.querySelector(link);
    if (!linkEl) {
      console.warn(`Navigation link ${link} not found`);
      return;
    }
    linkEl.addEventListener("click", (evt) => {
      evt.preventDefault();
      const currentActiveSec = document.querySelector(".active-sec");
      const currentActiveLink = document.querySelector(".active");
      if (currentActiveSec) {
        currentActiveSec.classList.remove("active-sec");
      }
      if (currentActiveLink) {
        currentActiveLink.classList.remove("active");
      }
      const sectionEl = document.querySelector(section);
      if (sectionEl) {
        sectionEl.classList.add("active-sec");
        evt.target.classList.add("active");
      } else {
        console.warn(`Section ${section} not found`);
      }
    });
  });
};

// Deliveries
const initDeliveries = () => {
  const deliveriesList = document.querySelector("#deliveries-list");
  const statusPopup = document.querySelector(".popup_type_status");
  const timelineContent = document.querySelector("#deal-timeline-content");

  if (!deliveriesList || !timelineContent) {
    console.warn("Deliveries list or timeline content not found");
    return;
  }

  // Сортировка таблицы
  const headers = document.querySelectorAll(".deliveries-table th.sortable");
  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const sortKey = header.dataset.sort;
      const isAscending = header.classList.toggle("asc");
      headers.forEach((h) => h !== header && h.classList.remove("asc", "desc"));
      header.classList.add(isAscending ? "asc" : "desc");

      const rows = Array.from(deliveriesList.querySelectorAll("tr"));
      rows.sort((a, b) => {
        let aValue, bValue;
        if (sortKey === "status") {
          aValue = a.querySelector(
            `td:nth-child(${
              sortKey === "status"
                ? 4
                : sortKey === "buyer"
                ? 3
                : sortKey === "lot"
                ? 2
                : sortKey === "date"
                ? 5
                : 1
            })`
          ).textContent;
          bValue = b.querySelector(
            `td:nth-child(${
              sortKey === "status"
                ? 4
                : sortKey === "buyer"
                ? 3
                : sortKey === "lot"
                ? 2
                : sortKey === "date"
                ? 5
                : 1
            })`
          ).textContent;
        } else {
          aValue = a.querySelector(
            `td:nth-child(${
              sortKey === "buyer"
                ? 3
                : sortKey === "lot"
                ? 2
                : sortKey === "date"
                ? 5
                : 1
            })`
          ).textContent;
          bValue = b.querySelector(
            `td:nth-child(${
              sortKey === "buyer"
                ? 3
                : sortKey === "lot"
                ? 2
                : sortKey === "date"
                ? 5
                : 1
            })`
          ).textContent;
        }
        return isAscending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
      deliveriesList.innerHTML = "";
      rows.forEach((row) => deliveriesList.appendChild(row));
    });
  });

  // Клик по строке таблицы
  deliveriesList.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (row) {
      const dealId = row.dataset.dealId;
      // Показываем таймлайн только для выбранной сделки
      const timelineEntries = timelineContent.querySelectorAll("p");
      timelineEntries.forEach((entry) => {
        entry.style.display =
          entry.dataset.dealId === dealId ? "block" : "none";
      });
    }

    // Клик по статусу
    const statusCell = e.target.closest("td:nth-child(4)");
    if (statusCell) {
      openModal(statusPopup);
      const statusForm = document.forms["status"];
      const statusSpan = statusCell.querySelector(".status-icon");
      const dealId = statusCell.closest("tr").dataset.dealId;

      statusForm.addEventListener("submit", function handler(e) {
        e.preventDefault();
        const newStatus = document.querySelector("#status-input").value;
        const comment = document.querySelector("#comment-input").value;
        statusSpan.textContent = newStatus;
        statusSpan.className = `status-icon ${
          newStatus === "Принято" ? "status-green" : "status-yellow"
        }`;

        // Добавляем запись в таймлайн
        const newEntry = document.createElement("p");
        newEntry.dataset.dealId = dealId;
        newEntry.textContent = `${new Date().toLocaleString()}: Фермер изменил статус на "${newStatus}". ${
          comment ? `Комментарий: ${comment}` : ""
        }`;
        timelineContent.appendChild(newEntry);

        // Показываем только записи для текущей сделки
        const timelineEntries = timelineContent.querySelectorAll("p");
        timelineEntries.forEach((entry) => {
          entry.style.display =
            entry.dataset.dealId === dealId ? "block" : "none";
        });

        if (newStatus === "Принято") {
          const paymentEntry = document.createElement("p");
          paymentEntry.dataset.dealId = dealId;
          paymentEntry.textContent = `${new Date().toLocaleString()}: Платёжка загружена (заглушка).`;
          timelineContent.appendChild(paymentEntry);
        }

        closeModal(statusPopup);
        statusForm.removeEventListener("submit", handler);
      });
    }
  });
};

// Auction
const initAuction = () => {
  let bids = [];
  let auctionTimer;
  let auctionEndTime;
  let bidInterval;
  let dealData = null; // Для хранения данных сделки для PDF

  const auctionBidsList = document.querySelector("#auction-bids-list");
  const startAuctionBtn = document.querySelector(".start-auction-btn");
  const auctionStatus = document.querySelector("#auction-status");
  const dealCard = document.querySelector(".deal-card");
  const confirmDealBtn = document.querySelector(".confirm-deal-btn");
  const dealPdfBtn = document.querySelector("#deal-pdf");

  if (
    !startAuctionBtn ||
    !auctionBidsList ||
    !auctionStatus ||
    !dealCard ||
    !confirmDealBtn ||
    !dealPdfBtn
  ) {
    console.warn(
      "One or more auction elements are missing. Auction functionality disabled."
    );
    return;
  }

  const participants = [
    "АгроТрейд",
    "Зерновой Союз",
    "Ферма Иванова",
    "Сельхоз Кооператив",
    "Торговая Лига",
  ];

  const formatPrice = (price) => `${parseInt(price).toLocaleString()} ₽`;

  const displayBids = () => {
    auctionBidsList.innerHTML = "";
    bids.forEach((bid) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${bid.participant}</td>
        <td>${formatPrice(bid.price)}</td>
        <td>${new Date(bid.time).toLocaleString()}</td>
      `;
      auctionBidsList.appendChild(row);
    });
  };

  const addBid = (participant, price) => {
    bids.push({ participant, price, time: Date.now() });
    displayBids();
  };

  const finishAuction = () => {
    clearInterval(auctionTimer);
    clearInterval(bidInterval);
    if (bids.length > 0) {
      const winner = bids.reduce((maxBid, currentBid) =>
        currentBid.price > maxBid.price ? currentBid : maxBid
      );
      auctionStatus.textContent = `Аукцион завершён! Победитель: ${
        winner.participant
      } с ценой ${formatPrice(winner.price)}`;

      // Сохраняем данные для PDF
      dealData = {
        id: "DEMO-001",
        buyer: winner.participant,
        price: formatPrice(winner.price),
        volume: "6 тонн",
        date: new Date().toLocaleString(),
      };

      // Создание протокола аукциона
      const protocolSection = document.createElement("div");
      protocolSection.classList.add("auction-protocol");
      protocolSection.innerHTML = `
        <h3>Протокол аукциона</h3>
        <p>Дата завершения: ${new Date().toLocaleString()}</p>
        <p>Победитель: ${winner.participant}</p>
        <p>Итоговая цена: ${formatPrice(winner.price)}</p>
        <p>Количество ставок: ${bids.length}</p>
      `;
      document.querySelector(".auc").appendChild(protocolSection);

      // Обновляем историю аукционов
      const auctionHistory = document.querySelector("#auction-history");
      if (auctionHistory) {
        const newAuction = document.createElement("li");
        newAuction.textContent = `Аукцион #DEMO-${
          bids.length
        }: Пшеница, 6 тонн, завершён ${new Date().toLocaleString()}`;
        auctionHistory.appendChild(newAuction);
      } else {
        console.warn("Auction history element not found");
      }

      // Показываем карточку сделки
      dealCard.style.display = "block";
      document.querySelector("#deal-buyer").textContent = winner.participant;
      document.querySelector("#deal-price").textContent = formatPrice(
        winner.price
      );
      document.querySelector("#deal-volume").textContent = "6 тонн";
      document.querySelector("#deal-status").textContent =
        "Ожидает подтверждения";
    } else {
      auctionStatus.textContent = "Аукцион завершён! Ставок не было.";
    }
  };

  startAuctionBtn.addEventListener("click", () => {
    auctionStatus.textContent = "Аукцион идёт!";
    startAuctionBtn.style.display = "none";
    auctionBidsList.parentElement.style.display = "table"; // Показываем таблицу ставок
    auctionEndTime = Date.now() + 30 * 1000; // 30 секунд для демо

    auctionTimer = setInterval(() => {
      const timeLeft = auctionEndTime - Date.now();
      const auctionTimerEl = document.querySelector("#auction-timer");
      if (timeLeft <= 0) {
        finishAuction();
        if (auctionTimerEl) {
          auctionTimerEl.textContent = "Аукцион завершён";
        }
      } else {
        if (auctionTimerEl) {
          auctionTimerEl.textContent = `${Math.ceil(timeLeft / 1000)} сек`;
        }
        auctionStatus.textContent = `Аукцион идёт`;
      }
    }, 1000);

    bidInterval = setInterval(() => {
      const participant =
        participants[Math.floor(Math.random() * participants.length)];
      const price = Math.floor(Math.random() * 5000) + 10000;
      addBid(participant, price);
    }, 8000);
  });

  confirmDealBtn.addEventListener("click", () => {
    document.querySelector("#deal-status").textContent =
      "Контракт ожидает подписи покупателя";
    confirmDealBtn.style.display = "none";

    setTimeout(() => {
      document.querySelector("#deal-status").textContent = "Контракт заключён";
      dealPdfBtn.style.display = "inline-block";

      // Добавляем сделку в таблицу
      const deliveriesList = document.querySelector("#deliveries-list");
      const newRow = document.createElement("tr");
      const dealId = `DEMO-${String(bids.length + 1).padStart(3, "0")}`;
      newRow.dataset.dealId = dealId;
      newRow.innerHTML = `
      <td>${dealId}</td>
      <td>Пшеница, 6 тонн</td>
      <td>${dealData.buyer}</td>
      <td><span class="status-icon status-yellow">Ожидает отгрузки</span></td>
      <td>${new Date().toLocaleDateString()}</td>
    `;
      deliveriesList.appendChild(newRow);

      // Добавляем запись в таймлайн
      const timelineContent = document.querySelector("#deal-timeline-content");
      const newEntry = document.createElement("p");
      newEntry.dataset.dealId = dealId;
      newEntry.textContent = `${new Date().toLocaleString()}: Сделка подтверждена фермером.`;
      timelineContent.appendChild(newEntry);
    }, 5000);
  });

  dealPdfBtn.addEventListener("click", () => {
    if (!dealData) {
      alert("Данные сделки недоступны.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Используем шрифт Times с поддержкой кириллицы
    doc.setFont("Times", "normal");
    doc.setFontSize(16);

    // Заголовок
    doc.text("Карточка сделки", 20, 20);

    // Данные сделки
    doc.setFontSize(12);
    doc.text(`ID сделки: ${dealData.id}`, 20, 40);
    doc.text(`Покупатель: ${dealData.buyer}`, 20, 50);
    doc.text(`Цена: ${dealData.price}`, 20, 60);
    doc.text(`Объём: ${dealData.volume}`, 20, 70);
    doc.text(`Дата: ${dealData.date}`, 20, 80);

    // Сохраняем PDF
    doc.save("deal-DEMO-001.pdf");
  });
};
