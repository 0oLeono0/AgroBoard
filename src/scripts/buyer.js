import { openModal, closeModal } from "./modal.js";
import { addPopupOpenListener } from "./popup.js";

export const initBuyer = () => {
  const catalogList = document.querySelector(".catalog .catalog__list");

  if (!catalogList) {
    console.warn("Catalog list not found in buyer.html");
    return;
  }

  // Текущий покупатель
  const currentBuyer = {
    id: "buyer-1",
    name: "ООО АгроТрейд",
  };

  // Другие покупатели (заглушка)
  const otherBuyers = [
    { id: "buyer-2", name: "ООО Хлебный путь" },
    { id: "buyer-3", name: "ИП Смирнов В.В." },
    { id: "buyer-4", name: "ООО ЗерноТрейд" },
  ];

  // Каталог объявлений
  const catalogAds = [
    {
      id: "ad-1",
      culture: "Пшеница",
      sort: "Луговая",
      addres: "Казахстан",
      price: "10000",
      value: "6",
      shipment: "2025-05-20",
      description: "Высококачественная пшеница",
      farmerId: "ООО Золотая Нива",
      createdAt: "2025-05-10T10:00:00Z",
      email: "[email protected]",
      phone: "+7 (701) 234-56-78",
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
      farmerId: "ИП Иванов А.А.",
      createdAt: "2025-05-09T12:00:00Z",
      email: "[email protected]",
      phone: "+7 (701) 234-56-78",
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
      farmerId: "ООО Сельхозпродукт",
      createdAt: "2025-05-08T15:00:00Z",
      email: "[email protected]",
      phone: "+7 (701) 234-56-78",
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
      farmerId: "ИП Петров П.П.",
      createdAt: "2025-05-07T09:00:00Z",
      email: "[email protected]",
      phone: "+7 (701) 234-56-78",
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
      farmerId: "ООО АгроСоюз",
      createdAt: "2025-05-06T14:00:00Z",
      email: "[email protected]",
      phone: "+7 (702) 345-67-89",
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
      farmerId: "ИП Сидоров С.С.",
      createdAt: "2025-05-05T11:00:00Z",
      email: "[email protected]",
      phone: "+7 (703) 456-78-90",
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
      farmerId: "ООО АлтайАгро",
      createdAt: "2025-05-04T16:00:00Z",
      email: "[email protected]",
      phone: "+7 (704) 567-89-01",
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
      farmerId: "ИП Кузнецов К.К.",
      createdAt: "2025-05-03T13:00:00Z",
      email: "[email protected]",
      phone: "+7 (705) 678-90-12",
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
      farmerId: "ООО МаслоТорг",
      createdAt: "2025-05-02T10:00:00Z",
      email: "[email protected]",
      phone: "+7 (706) 789-01-23",
    },
  ];

  // Массив встречных заявок
  const counterOffers = [];

  // Массив уведомлений
  const notifications = [];

  // Массив контрактов
  // Массив контрактов
  const contracts = [
    {
      id: "contract-1",
      lot: "Пшеница",
      farmerId: "ООО Золотая Нива",
      buyerId: currentBuyer.id,
      buyerName: currentBuyer.name,
      price: 10000,
      volume: 6,
      status: "pending-buyer", // Ожидает подтверждения покупателя
      createdAt: "2025-05-14T10:00:00Z",
    },
    {
      id: "contract-2",
      lot: "Рожь",
      farmerId: "ИП Иванов А.А.",
      buyerId: currentBuyer.id,
      buyerName: currentBuyer.name,
      price: 8500,
      volume: 10,
      status: "pending-farmer", // Ожидает подтверждения продавца
      buyerConfirmed: true, // Покупатель уже подтвердил
      createdAt: "2025-05-14T11:00:00Z",
    },
    {
      id: "contract-3",
      lot: "Ячмень",
      farmerId: "ООО Сельхозпродукт",
      buyerId: currentBuyer.id,
      buyerName: currentBuyer.name,
      price: 9000,
      volume: 8,
      status: "confirmed", // Принято (обе стороны подтвердили)
      buyerConfirmed: true,
      farmerConfirmed: true,
      createdAt: "2025-05-14T12:00:00Z",
    },
    {
      id: "contract-4",
      lot: "Кукуруза",
      farmerId: "ИП Петров П.П.",
      buyerId: currentBuyer.id,
      buyerName: currentBuyer.name,
      price: 12000,
      volume: 12,
      status: "paid", // Оплачено
      buyerConfirmed: true,
      farmerConfirmed: true,
      paymentFile: "payment-order-123.pdf", // Файл платёжного поручения
      createdAt: "2025-05-14T13:00:00Z",
    },
  ];

  // Массив аукционов
  const auctions = [
    {
      id: "auc-1",
      lot: "Пшеница",
      farmerId: "ООО Золотая Нива",
      volume: 6,
      currentBid: 10000,
      minStep: 500,
      endTime: "2025-05-14T16:00:00Z", // 03:12 PM + ~1 hour
      bidders: [{ buyerId: otherBuyers[0].id, bid: 10000 }],
      status: "active",
    },
    {
      id: "auc-2",
      lot: "Рожь",
      farmerId: "ИП Иванов А.А.",
      volume: 10,
      currentBid: 8500,
      minStep: 500,
      endTime: "2025-05-14T17:00:00Z", // 03:12 PM + 2 hours
      bidders: [{ buyerId: otherBuyers[1].id, bid: 8500 }],
      status: "active",
    },
    {
      id: "auc-3",
      lot: "Ячмень",
      farmerId: "ООО Сельхозпродукт",
      volume: 8,
      currentBid: 9000,
      minStep: 500,
      endTime: "2025-05-14T18:00:00Z", // 03:12 PM + 3 hours
      bidders: [{ buyerId: otherBuyers[2].id, bid: 9000 }],
      status: "active",
    },
    {
      id: "auc-4",
      lot: "Кукуруза",
      farmerId: "ИП Петров П.П.",
      volume: 12,
      currentBid: 12000,
      minStep: 500,
      endTime: new Date(Date.now() + 30 * 1000).toISOString(), // 03:12 PM + 30 seconds (for testing)
      bidders: [],
      status: "active",
    },
    {
      id: "auc-5",
      lot: "Овёс",
      farmerId: "ИП Сидоров С.С.",
      volume: 7,
      currentBid: 7000,
      minStep: 500,
      endTime: "2025-05-14T19:00:00Z", // 03:12 PM + 4 hours
      bidders: [{ buyerId: otherBuyers[0].id, bid: 7000 }],
      status: "active",
    },
  ];

  // Рендеринг каталога
  function renderCatalogList(ads) {
    const header = catalogList.querySelector(".catalog__list-header");
    catalogList.innerHTML = "";
    catalogList.appendChild(header);
    ads.forEach((ad) => {
      const newAd = document.createElement("li");
      newAd.classList.add("catalog__item");
      newAd.dataset.id = ad.id;
      newAd.innerHTML = `
        <span class="catalog__ad">${ad.culture}</span>
        <span class="catalog__ad">${ad.sort}</span>
        <span class="catalog__ad">${ad.addres}</span>
        <span class="catalog__ad">${ad.price}</span>
        <span class="catalog__ad">${ad.value}</span>
        <span class="catalog__ad">${ad.shipment}</span>
        <span class="catalog__ad">${ad.description}</span>
      `;
      catalogList.appendChild(newAd);
    });

    const adItems = document.querySelectorAll(".catalog__item");
    adItems.forEach((item) => {
      item.addEventListener("click", () => {
        const adId = item.dataset.id;
        const ad = catalogAds.find((ad) => ad.id === adId);
        if (ad) {
          const detailPopup = document.querySelector("#ad-detail-popup");
          if (!detailPopup) {
            console.warn("Ad detail popup not found");
            return;
          }

          detailPopup
            .querySelectorAll(".ad-detail__value")
            .forEach((element) => {
              const field = element.dataset.field;
              element.textContent = ad[field] || "Не указано";
            });

          openModal(detailPopup);
        }
      });
    });
  }

  // Обработка кнопки "Связаться"
  const initContactButton = () => {
    const contactButton = document.querySelector(".contact-button");
    if (!contactButton) return;

    contactButton.addEventListener("click", () => {
      const detailPopup = document.querySelector("#ad-detail-popup");
      const contactPopup = document.querySelector("#contact-popup");
      if (!detailPopup || !contactPopup) {
        console.warn("Contact popup not found");
        return;
      }

      const email = detailPopup.querySelector(
        ".ad-detail__value[data-field='email']"
      ).textContent;
      const phone = detailPopup.querySelector(
        ".ad-detail__value[data-field='phone']"
      ).textContent;

      contactPopup.querySelector(
        ".contact-value[data-field='email']"
      ).textContent = email;
      contactPopup.querySelector(
        ".contact-value[data-field='phone']"
      ).textContent = phone;

      closeModal(detailPopup);
      openModal(contactPopup);

      const copyButton = contactPopup.querySelector(".copy-button");
      copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(email).then(() => {
          const notif = document.createElement("div");
          notif.textContent = "E-mail скопирован в буфер обмена!";
          notif.className = "notification__message";
          document.body.appendChild(notif);
          setTimeout(() => notif.remove(), 3000);
        });
      });

      const callButton = contactPopup.querySelector(".call-button");
      callButton.addEventListener("click", () => {
        window.location.href = `tel:${phone}`;
      });
    });
  };

  // Обработка кнопки "Создать встречную заявку"
  const initRequestButton = () => {
    const requestButton = document.querySelector(".request-button");
    if (!requestButton) return;

    const requestPopup = document.querySelector("#request-popup");
    if (!requestPopup) {
      console.warn("Request popup not found");
      return;
    }

    let currentAd = null;

    requestButton.addEventListener("click", () => {
      const detailPopup = document.querySelector("#ad-detail-popup");
      if (!detailPopup) {
        console.warn("Ad detail popup not found");
        return;
      }

      const adId =
        detailPopup.querySelector(".ad-detail__value[data-field='id']")
          ?.textContent || "";
      currentAd = catalogAds.find((ad) => ad.id === adId);
      if (!currentAd) {
        currentAd = catalogAds.find(
          (ad) =>
            ad.culture ===
            detailPopup.querySelector(".ad-detail__value[data-field='culture']")
              .textContent
        );
      }

      const volumeInput = requestPopup.querySelector("#request-volume");
      volumeInput.setAttribute("max", currentAd.value);
      volumeInput.value = "";
      requestPopup.querySelector("#request-price").value = "";
      requestPopup.querySelector("#request-comment").value = "";

      closeModal(detailPopup);
      openModal(requestPopup);
    });

    const requestForm = requestPopup.querySelector(".request-form");
    if (requestForm) {
      requestForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const volume = parseFloat(
          requestForm.querySelector("#request-volume").value
        );
        const price = parseFloat(
          requestForm.querySelector("#request-price").value
        );
        const comment = requestForm.querySelector("#request-comment").value;

        if (volume > parseFloat(currentAd.value)) {
          const errorNotif = document.createElement("div");
          errorNotif.textContent =
            "Объём не может превышать предложенный в объявлении!";
          errorNotif.className = "notification__message error";
          document.body.appendChild(errorNotif);
          setTimeout(() => errorNotif.remove(), 3000);
          return;
        }

        const counterOffer = {
          id: `counter-${counterOffers.length + 1}`,
          adId: currentAd.id,
          buyerId: currentBuyer.id,
          buyerName: currentBuyer.name,
          farmerId: currentAd.farmerId,
          culture: currentAd.culture,
          volume,
          price,
          comment,
          status: "pending",
          createdAt: new Date().toISOString(),
        };

        counterOffers.push(counterOffer);

        contracts.push({
          id: `contract-${contracts.length + 1}`,
          lot: currentAd.culture,
          farmerId: currentAd.farmerId,
          buyerId: currentBuyer.id,
          buyerName: currentBuyer.name,
          price: price,
          volume: volume,
          status: "pending-buyer",
          createdAt: new Date().toISOString(),
        });

        notifications.push({
          id: `notif-${notifications.length + 1}`,
          userId: currentAd.farmerId,
          type: "counter-offer",
          counterOfferId: counterOffer.id,
          message: `Покупатель ${currentBuyer.name} отправил встречную заявку на ${currentAd.culture}: ${volume} тонн по ${price} ₽/т.`,
          createdAt: new Date().toISOString(),
        });

        notifications.push({
          id: `notif-${notifications.length + 1}`,
          userId: currentBuyer.id,
          type: "counter-offer-sent",
          counterOfferId: counterOffer.id,
          message: `Ваша встречная заявка на ${currentAd.culture} (${volume} тонн по ${price} ₽/т) отправлена продавцу ${currentAd.farmerId}.`,
          createdAt: new Date().toISOString(),
        });

        renderNotifications();
        renderContracts();
        closeModal(requestPopup);
      });
    }
  };

  // Рендеринг уведомлений
  const renderNotifications = () => {
    const notificationsList = document.querySelector(".notifications__list");
    const notificationsSection = document.querySelector(".notifications");
    const contractsSection = document.querySelector(".contracts");
    const placeholder = document.querySelector(".deals__placeholder");

    if (
      !notificationsList ||
      !notificationsSection ||
      !contractsSection ||
      !placeholder
    )
      return;

    notificationsList.innerHTML = "";
    const userNotifications = notifications.filter(
      (notif) => notif.userId === currentBuyer.id
    );
    userNotifications.forEach((notif) => {
      const li = document.createElement("li");
      li.classList.add("notification__item");
      li.dataset.notificationId = notif.id;

      if (
        notif.type === "counter-offer-sent" ||
        notif.type === "contract-pending" ||
        notif.type === "contract-confirmed" ||
        notif.type === "auction-bid" ||
        notif.type === "auction-won"
      ) {
        li.innerHTML = `<span>${notif.message}</span>`;
      }

      notificationsList.appendChild(li);
    });

    updateDealsVisibility();
  };

  // Рендеринг контрактов
  const renderContracts = () => {
    const contractsList = document.querySelector(".contracts__list");
    const notificationsSection = document.querySelector(".notifications");
    const contractsSection = document.querySelector(".contracts");
    const placeholder = document.querySelector(".deals__placeholder");

    if (
      !contractsList ||
      !notificationsSection ||
      !contractsSection ||
      !placeholder
    )
      return;

    const header = contractsList.querySelector(".contracts__header");
    contractsList.innerHTML = "";
    contractsList.appendChild(header);

    contracts.forEach((contract) => {
      const li = document.createElement("li");
      li.classList.add("contract__item");
      li.dataset.contractId = contract.id;

      const statusText =
        contract.status === "pending-buyer"
          ? "Ожидает вашего подтверждения"
          : contract.status === "pending-farmer"
          ? "Ожидает подтверждения продавца"
          : contract.status === "confirmed"
          ? "Принято"
          : contract.status === "paid"
          ? "Оплачено"
          : "Неизвестный статус";

      const actionButton =
        contract.status === "pending-buyer"
          ? `<button class="contract__button confirm-contract" data-contract-id="${contract.id}">Подтвердить</button>`
          : contract.status === "confirmed"
          ? `<button class="contract__button upload-payment" data-contract-id="${contract.id}">Загрузить платёжное поручение</button>`
          : contract.status === "paid"
          ? `<button class="contract__button download-report" data-contract-id="${contract.id}">Скачать отчёт</button>`
          : "";

      li.innerHTML = `
        <span class="contract__field">${contract.id}</span>
        <span class="contract__field">${contract.lot}</span>
        <span class="contract__field">${contract.farmerId}</span>
        <span class="contract__field">${contract.price} ₽/т</span>
        <span class="contract__field">${contract.volume} т</span>
        <span class="contract__field">${statusText}</span>
        <span class="contract__field">${actionButton}</span>
      `;

      contractsList.appendChild(li);
    });

    // Имитация подтверждения продавца через 10 секунд
    contracts.forEach((contract) => {
      if (
        contract.status === "pending-farmer" &&
        !contract.farmerConfirmationTimer
      ) {
        contract.farmerConfirmationTimer = setTimeout(() => {
          contract.farmerConfirmed = true;
          contract.status = "confirmed";
          notifications.push({
            id: `notif-${notifications.length + 1}`,
            userId: contract.buyerId,
            type: "contract-confirmed",
            contractId: contract.id,
            message: `Контракт ${contract.id} полностью подтверждён.`,
            createdAt: new Date().toISOString(),
          });
          renderNotifications();
          renderContracts();
        }, 10000); // 10 секунд
      }
    });

    updateDealsVisibility();

    // Обработчик для кнопки "Подтвердить"
    const confirmButtons = document.querySelectorAll(".confirm-contract");
    confirmButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const contractId = button.dataset.contractId;
        const contract = contracts.find((c) => c.id === contractId);
        if (!contract) return;

        const confirmPopup = document.querySelector("#confirm-contract-popup");
        if (!confirmPopup) {
          console.warn("Confirm contract popup not found");
          return;
        }

        confirmPopup.querySelector(
          ".contract-detail__value[data-field='lot']"
        ).textContent = contract.lot;
        confirmPopup.querySelector(
          ".contract-detail__value[data-field='farmerId']"
        ).textContent = contract.farmerId;
        confirmPopup.querySelector(
          ".contract-detail__value[data-field='price']"
        ).textContent = contract.price;
        confirmPopup.querySelector(
          ".contract-detail__value[data-field='volume']"
        ).textContent = contract.volume;

        openModal(confirmPopup);

        const confirmButton = confirmPopup.querySelector(
          ".confirm-contract-button"
        );
        confirmButton.addEventListener("click", () => {
          if (contract.status === "pending-buyer") {
            contract.buyerConfirmed = true;
            contract.status = contract.farmerConfirmed
              ? "confirmed"
              : "pending-farmer";
          }

          if (contract.status === "confirmed") {
            notifications.push({
              id: `notif-${notifications.length + 1}`,
              userId: contract.buyerId,
              type: "contract-confirmed",
              contractId: contract.id,
              message: `Контракт ${contract.id} полностью подтверждён.`,
              createdAt: new Date().toISOString(),
            });
          }

          renderNotifications();
          renderContracts();
          closeModal(confirmPopup);
        });
      });
    });

    // Обработчик для кнопки "Загрузить платёжное поручение"
    const uploadButtons = document.querySelectorAll(".upload-payment");
    uploadButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const contractId = button.dataset.contractId;
        const contract = contracts.find((c) => c.id === contractId);
        if (!contract) return;

        const uploadPopup = document.querySelector("#upload-payment-popup");
        if (!uploadPopup) {
          console.warn("Upload payment popup not found");
          return;
        }

        openModal(uploadPopup);

        const uploadForm = uploadPopup.querySelector(".upload-payment-form");
        const fileInput = uploadPopup.querySelector("#payment-file");
        uploadForm.addEventListener("submit", (e) => {
          e.preventDefault();
          if (fileInput.files.length > 0) {
            contract.status = "paid";
            contract.paymentFile = fileInput.files[0].name; // Сохраняем имя файла (имитация)

            notifications.push({
              id: `notif-${notifications.length + 1}`,
              userId: contract.buyerId,
              type: "contract-paid",
              contractId: contract.id,
              message: `Платёжное поручение для контракта ${contract.id} загружено. Статус: Оплачено.`,
              createdAt: new Date().toISOString(),
            });

            renderNotifications();
            renderContracts();
            closeModal(uploadPopup);
          } else {
            const errorNotif = document.createElement("div");
            errorNotif.textContent = "Пожалуйста, выберите файл для загрузки!";
            errorNotif.className = "notification__message error";
            document.body.appendChild(errorNotif);
            setTimeout(() => errorNotif.remove(), 3000);
          }
        });
      });
    });

    // Обработчик для кнопки "Скачать отчёт"
    const downloadButtons = document.querySelectorAll(".download-report");
    downloadButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const contractId = button.dataset.contractId;
        const contract = contracts.find((c) => c.id === contractId);
        if (!contract) return;

        const reportContent = generateReport(contract);
        const blob = new Blob([reportContent], { type: "application/x-tex" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `contract-report-${contract.id}.tex`;
        a.click();
        URL.revokeObjectURL(url);
      });
    });
  };

  // Генерация PDF-отчёта в формате LaTeX
  const generateReport = (contract) => {
    return `
\\documentclass[a4paper,12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[russian]{babel}
\\usepackage{geometry}
\\geometry{margin=1in}
\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[C]{Итоговый отчёт по контракту №${contract.id}}
\\fancyfoot[C]{\\thepage}

\\begin{document}

\\begin{center}
  \\Large \\textbf{Итоговый отчёт по контракту №${contract.id}} \\\\
  \\normalsize Для покупателя, продавца и реестра контроля
\\end{center}

\\vspace{1cm}

\\section*{Детали контракта}
\\begin{itemize}
  \\item \\textbf{ID контракта:} ${contract.id}
  \\item \\textbf{Лот:} ${contract.lot}
  \\item \\textbf{Продавец:} ${contract.farmerId}
  \\item \\textbf{Покупатель:} ${contract.buyerName || "ООО АгроТрейд"}
  \\item \\textbf{Цена:} ${contract.price} ₽/т
  \\item \\textbf{Объём:} ${contract.volume} т
  \\item \\textbf{Дата создания:} ${new Date(
    contract.createdAt
  ).toLocaleDateString("ru-RU")}
  \\item \\textbf{Статус:} Оплачено
  \\item \\textbf{Файл платёжного поручения:} ${
    contract.paymentFile || "Не указано"
  }
\\end{itemize}

\\vspace{1cm}

\\section*{Подписи}
\\begin{itemize}
  \\item Продавец: ___________________________ (Подпись)
  \\item Покупатель: ___________________________ (Подпись)
  \\item Реестр контроля: ___________________________ (Подпись)
\\end{itemize}

\\end{document}
    `;
  };

  // Функция для управления видимостью заглушки в сделках
  const updateDealsVisibility = () => {
    const notificationsSection = document.querySelector(".notifications");
    const contractsSection = document.querySelector(".contracts");
    const placeholder = document.querySelector(".deals__placeholder");

    const userNotifications = notifications.filter(
      (notif) => notif.userId === currentBuyer.id
    );
    const hasData = userNotifications.length > 0 || contracts.length > 0;

    if (hasData) {
      placeholder.classList.add("deals__placeholder--hidden");
      notificationsSection.classList.remove("notifications--hidden");
      contractsSection.classList.remove("contracts--hidden");
    } else {
      placeholder.classList.remove("deals__placeholder--hidden");
      notificationsSection.classList.add("notifications--hidden");
      contractsSection.classList.add("contracts--hidden");
    }
  };

  // Рендеринг аукционов
  const renderAuctions = () => {
    const aucList = document.querySelector(".auc__list");
    const placeholder = document.querySelector(".auc__placeholder");

    if (!aucList || !placeholder) return;

    const header = aucList.querySelector(".auc__list-header");
    aucList.innerHTML = "";
    aucList.appendChild(header);

    const activeAuctions = auctions.filter((auc) => auc.status === "active");
    if (activeAuctions.length === 0) {
      placeholder.classList.remove("auc__placeholder--hidden");
      return;
    } else {
      placeholder.classList.add("auc__placeholder--hidden");
    }

    activeAuctions.forEach((auc) => {
      const li = document.createElement("li");
      li.classList.add("auc__item");
      li.dataset.auctionId = auc.id;

      const currentLeader =
        auc.bidders.length > 0
          ? auc.bidders[auc.bidders.length - 1].buyerId
          : "Нет ставок";
      const leaderName =
        currentLeader !== "Нет ставок"
          ? otherBuyers.find((b) => b.id === currentLeader)?.name ||
            currentBuyer.name
          : "Нет ставок";
      const timeLeft = calculateTimeLeft(auc.endTime);

      li.innerHTML = `
        <span class="auc__field">${auc.lot}</span>
        <span class="auc__field">${auc.farmerId}</span>
        <span class="auc__field">${auc.currentBid} ₽/т</span>
        <span class="auc__field">${leaderName}</span>
        <span class="auc__field auc__timer" data-end-time="${
          auc.endTime
        }">${timeLeft}</span>
        <span class="auc__field">
          <button class="auc__button bid-button" data-auction-id="${auc.id}" ${
        timeLeft === "Аукцион завершён" ? "disabled" : ""
      }>Сделать ставку</button>
        </span>
      `;

      aucList.appendChild(li);
    });

    const bidButtons = document.querySelectorAll(".bid-button");
    bidButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const auctionId = button.dataset.auctionId;
        const auction = auctions.find((auc) => auc.id === auctionId);
        if (!auction) return;

        const bidPopup = document.querySelector("#bid-popup");
        if (!bidPopup) {
          console.warn("Bid popup not found");
          return;
        }

        bidPopup.querySelector(
          ".bid-detail__value[data-field='lot']"
        ).textContent = auction.lot;
        bidPopup.querySelector(
          ".bid-detail__value[data-field='farmerId']"
        ).textContent = auction.farmerId;
        bidPopup.querySelector(
          ".bid-detail__value[data-field='currentBid']"
        ).textContent = auction.currentBid;
        bidPopup.querySelector(
          ".bid-detail__value[data-field='minBid']"
        ).textContent = auction.currentBid + auction.minStep;

        const bidInput = bidPopup.querySelector("#bid-amount");
        bidInput.setAttribute("min", auction.currentBid + auction.minStep);
        bidInput.value = auction.currentBid + auction.minStep;

        openModal(bidPopup);

        const bidForm = bidPopup.querySelector(".bid-form");
        bidForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const newBid = parseFloat(bidInput.value);

          if (newBid < auction.currentBid + auction.minStep) {
            const errorNotif = document.createElement("div");
            errorNotif.textContent = `Ставка должна быть не менее ${
              auction.currentBid + auction.minStep
            } ₽/т!`;
            errorNotif.className = "notification__message error";
            document.body.appendChild(errorNotif);
            setTimeout(() => errorNotif.remove(), 3000);
            return;
          }

          const previousBidders = [...auction.bidders];
          auction.currentBid = newBid;
          auction.bidders.push({ buyerId: currentBuyer.id, bid: newBid });

          previousBidders.forEach((bidder) => {
            if (bidder.buyerId !== currentBuyer.id) {
              notifications.push({
                id: `notif-${notifications.length + 1}`,
                userId: bidder.buyerId,
                type: "auction-bid",
                auctionId: auction.id,
                message: `Вашу ставку на лот ${auction.lot} перебил ${currentBuyer.name} с ${newBid} ₽/т.`,
                createdAt: new Date().toISOString(),
              });
            }
          });

          notifications.push({
            id: `notif-${notifications.length + 1}`,
            userId: currentBuyer.id,
            type: "auction-bid",
            auctionId: auction.id,
            message: `Вы сделали ставку ${newBid} ₽/т на лот ${auction.lot}.`,
            createdAt: new Date().toISOString(),
          });

          contracts.push({
            id: `contract-${contracts.length + 1}`,
            lot: auction.lot,
            farmerId: auction.farmerId,
            buyerId: currentBuyer.id,
            buyerName: currentBuyer.name,
            price: auction.currentBid,
            volume: auction.volume,
            status: "pending-buyer",
            createdAt: new Date().toISOString(),
          });

          renderNotifications();
          renderAuctions();
          closeModal(bidPopup);
        });
      });
    });
  };

  // Расчёт времени до окончания аукциона
  const calculateTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) {
      return "Аукцион завершён";
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}ч ${minutes}м ${seconds}с`;
  };

  // Обновление таймеров каждую секунду
  const updateAuctionTimers = () => {
    const timers = document.querySelectorAll(".auc__timer");
    timers.forEach((timer) => {
      const endTime = timer.dataset.endTime;
      const timeLeft = calculateTimeLeft(endTime);
      timer.textContent = timeLeft;

      if (timeLeft === "Аукцион завершён") {
        const auctionId = timer.closest(".auc__item").dataset.auctionId;
        const auction = auctions.find((auc) => auc.id === auctionId);
        if (auction && auction.status === "active") {
          auction.status = "ended";
          if (auction.bidders.length > 0) {
            const winner = auction.bidders[auction.bidders.length - 1];
            const winnerName =
              winner.buyerId === currentBuyer.id
                ? currentBuyer.name
                : otherBuyers.find((b) => b.id === winner.buyerId)?.name ||
                  winner.buyerId;
            contracts.push({
              id: `contract-${contracts.length + 1}`,
              lot: auction.lot,
              farmerId: auction.farmerId,
              buyerId: winner.buyerId,
              buyerName: winnerName,
              price: auction.currentBid,
              volume: auction.volume,
              status: "pending-buyer",
              createdAt: new Date().toISOString(),
            });

            notifications.push({
              id: `notif-${notifications.length + 1}`,
              userId: winner.buyerId,
              type: "auction-won",
              auctionId: auction.id,
              message: `Поздравляем! Вы выиграли аукцион на лот ${auction.lot} за ${auction.currentBid} ₽/т. Подтвердите контракт.`,
              createdAt: new Date().toISOString(),
            });
          }
          renderNotifications();
          renderContracts();
          renderAuctions();
        }
      }
    });
  };

  // Случайные ставки от других покупателей
  const simulateBidding = () => {
    const activeAuctions = auctions.filter((auc) => auc.status === "active");
    if (activeAuctions.length === 0) return;

    activeAuctions.forEach((auction) => {
      if (Math.random() < 0.3) {
        // 30% вероятность ставки каждые 30 секунд
        const randomBuyer =
          otherBuyers[Math.floor(Math.random() * otherBuyers.length)];
        const randomBid =
          auction.currentBid +
          auction.minStep * (Math.floor(Math.random() * 3) + 1);
        auction.bidders.push({ buyerId: randomBuyer.id, bid: randomBid });
        auction.currentBid = randomBid;

        notifications.push({
          id: `notif-${notifications.length + 1}`,
          userId: currentBuyer.id,
          type: "auction-bid",
          auctionId: auction.id,
          message: `Ставку на лот ${auction.lot} повысил ${randomBuyer.name} до ${randomBid} ₽/т!`,
          createdAt: new Date().toISOString(),
        });

        renderNotifications();
        renderAuctions();
      }
    });
  };

  // Фильтрация и сортировка каталога
  const filterAndSortCatalog = () => {
    const filterForm = document.querySelector(".catalog__filters");
    if (!filterForm) {
      console.warn("Filter form not found");
      return;
    }

    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const culture = document.querySelector("#filter-culture").value;
      const sort = document.querySelector("#filter-sort").value;
      const region = document.querySelector("#filter-region").value;
      const priceMin =
        parseFloat(document.querySelector("#filter-price-min").value) || 0;
      const priceMax =
        parseFloat(document.querySelector("#filter-price-max").value) ||
        Infinity;
      const volumeMin =
        parseFloat(document.querySelector("#filter-volume-min").value) || 0;
      const volumeMax =
        parseFloat(document.querySelector("#filter-volume-max").value) ||
        Infinity;
      const sortBy = document.querySelector("#sort-by").value;

      let filteredAds = catalogAds.filter((ad) => {
        return (
          (!culture || ad.culture === culture) &&
          (!sort || ad.sort === sort) &&
          (!region || ad.addres.includes(region)) &&
          parseFloat(ad.price) >= priceMin &&
          parseFloat(ad.price) <= priceMax &&
          parseFloat(ad.value) >= volumeMin &&
          parseFloat(ad.value) <= volumeMax
        );
      });

      filteredAds = filteredAds.sort((a, b) => {
        if (sortBy === "price-asc") {
          return parseFloat(a.price) - parseFloat(b.price);
        } else if (sortBy === "price-desc") {
          return parseFloat(b.price) - parseFloat(a.price);
        } else if (sortBy === "date-desc") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === "date-asc") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return 0;
      });

      renderCatalogList(filteredAds);
    });

    const resetButton = document.querySelector(".catalog__filters-reset");
    resetButton.addEventListener("click", () => {
      filterForm.reset();
      renderCatalogList(catalogAds);
    });
  };

  // Навигация
  const initNavigation = () => {
    const sections = {
      catalog: { link: ".header__link-catalog", section: ".catalog" },
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

  // Инициализация
  renderCatalogList(catalogAds);
  filterAndSortCatalog();
  initNavigation();
  initContactButton();
  initRequestButton();
  renderNotifications();
  renderContracts();
  renderAuctions();

  // Обновляем таймеры каждую секунду
  setInterval(updateAuctionTimers, 1000);

  // Случайные ставки каждые 30 секунд
  setInterval(simulateBidding, 30000);
};

// Добавляем стили для уведомлений
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .notification__message {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #4a7150;
    color: #fff;
    border-radius: 5px;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  .notification__message.error {
    background-color: #d32f2f;
  }
`;
document.head.appendChild(styleSheet);
