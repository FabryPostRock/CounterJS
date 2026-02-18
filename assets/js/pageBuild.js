/**
 * Crea le modali:
 * - crea ogni nodo con document.createElement
 * - assegna classi/attributi
 * - costruisce l'albero e lo appende al body
 */
function buildGenderSelModalNoInnerHTML() {
    // Se esiste già, la rimuovo
    const existing = document.getElementById("genderSel");
    if (existing) existing.remove();


    const el = (tag, { className, id, attrs, text } = {}) => {
        /* Helpers
        = {} : serve come valore di default per il secondo parametro, 
            così la funzione funziona anche se tu non passi nessun oggetto di opzioni.
        */
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (id) node.id = id;
        if (text != null) node.textContent = text;
        if (attrs) {
        for (const [k, v] of Object.entries(attrs)) {
            if (v === null || v === undefined) continue;
            node.setAttribute(k, String(v));
        }
        }
        return node;
    };


    //--------------------------------------- MODAL genderSel ------------------------------
    const modalDefaultOptions = {
        className: "modal modal-lg",
        attrs: {
            "data-bs-backdrop": "static",
            "data-bs-keyboard": "false",
            tabindex: "-1",
            "aria-labelledby": "staticBackdropLabel",
        },
    };

    const modalGenderSel = el("div", {
        ...modalDefaultOptions, // se hai un oggetto opzioni riusabile
        id: "genderSel"
    });
    const dialog = el("div", { className: "modal-dialog" });
    const content = el("div", { className: "modal-content" });

    // Header
    const header = el("div", { className: "modal-header" });

    titleDefaultOptions = {
        className: "modal-title",
        id: "staticBackdropLabel", 
    };
 
    const title = el("h5", {
        ...titleDefaultOptions,
        text: "Uomo o Donna? Seleziona il genere per ottenere il badge che ti rispecchi al 100%!",
    });

    const btnCloseXDefaultOpt = {
        className: "btn-close",
        attrs: {
            type: "button",
            "data-bs-dismiss": "modal",
            "aria-label": "Close",
        },
    }
    const btnCloseX = el("button", { 
        ...btnCloseXDefaultOpt,
        attrs: {
            ...btnCloseXDefaultOpt.attrs,
            name: "genderSelector"
        }
        
    });

    header.append(title, btnCloseX);

    // Body
    const body = el("div", { className: "modal-body" });
    const row = el("div", { className: "row" });

    const form = el("form", {
        id: "form-gender-sel",
        className: "fs-5 mt-4 needs-validation",
    });
 
    const formRow = el("div", {
        className: "d-flex row align-content-center justify-content-center",
    });

    // ---- MAN block
    const manWrap = el("div", {
        className:
        "form-check col-12 col-sm-5 d-flex flex-column align-items-center position-relative",
    });
    const note = document.createComment("<!--Perché visually-hidden e non display:none?"+
                                            "- display:none rende l’input inesistente per alcuni flussi (screen reader, focus, validazione UX)."+
                                            "- visually-hidden lo nasconde solo visivamente ma rimane nel form, quindi required e value funzionano. -->");
    const inputDefaultOpt = {
        className: "form-check-input visually-hidden",
        attrs: {
        type: "radio",
        name: "genderSelection",
        required: "",
        },        
    }            

    const manInput = el("input", {
        ...inputDefaultOpt,
        id: "manRadioSel",
        value: "man"        
    });

    const manLabel = el("label", {
        className: "form-check-label cursor-pointer d-block",
        attrs: { for: "manRadioSel" },
    });

    const imgDefaultOpt = {
        className: "img-fluid",
        attrs: {
        width: "150",
        height: "auto",
        loading: "lazy",
        },        
    }
    const manImg = el("img", {
        ...imgDefaultOpt,
        attrs: {
            ...imgDefaultOpt.attrs, 
            alt: "Seleziona Uomo", 
            src: "assets/img/man.png",
        }
    });
    /*appendChild(node)
        - accetta solo un Node (elemento, text node, comment, ecc.)
        - se passi una stringa → errore
        - ritorna il nodo aggiunto (utile se vuoi salvarlo) 
    */
    manLabel.appendChild(manImg);
    /*
    append(...items)
        - accetta più argomenti
        - ogni argomento può essere Node oppure stringa
        - le stringhe vengono aggiunte come TextNode
        - ritorna undefined
    */
    manWrap.append(note, manInput, manLabel);

    // ---- WOMAN block
    const womanWrap = el("div", {
        className:
        "form-check col-12 col-sm-5 d-flex flex-column align-items-center position-relative mt-5 mt-sm-0",
    });

    const womanInput = el("input", {
        ...inputDefaultOpt,
        id: "womanRadioSel",
        value: "woman"       
    });
    const womanLabel = el("label", {
        className: "form-check-label cursor-pointer d-block",
        attrs: { for: "womanRadioSel" },
    });

    const womanImg = el("img", {
        ...imgDefaultOpt,
        attrs: {
            ...imgDefaultOpt.attrs, 
            src: "assets/img/woman.png",
            alt: "Seleziona Donna",
        }
    });
    womanLabel.appendChild(womanImg);
    womanWrap.append(womanInput, womanLabel);

    // compongo i due blocchi
    formRow.append(manWrap, womanWrap);

    // Submit area
    const submitRow = el("div", {
        className: "d-flex align-items-center justify-content-center",
    });

    const submitCol = el("div", {
        className: "col-12 d-flex align-items-center justify-content-center mt-4",
    });

    const btnSubmit = el("button", {
        className: "btn btn-secondary mb-3",
        attrs: { type: "submit" },
        text: "Salva",
    });

    submitCol.appendChild(btnSubmit);
    submitRow.appendChild(submitCol);

    // form assembly
    form.append(formRow, submitRow);
    row.appendChild(form);
    body.appendChild(row);

    // Footer
    const footer = el("div", { className: "modal-footer" });

    const btnClose = el("button", {
        className: "btn btn-secondary",
        attrs: {
        type: "button",
        name: "genderSelection",
        "data-bs-dismiss": "modal",
        },
        text: "Chiudi",
    });

    footer.appendChild(btnClose);

    // Compose modal tree
    content.append(header, body, footer);
    dialog.appendChild(content);
    modal.appendChild(dialog);

    document.body.appendChild(modalGenderSel);


    //----------------------------------MODAL playerResult------------------------
    const modalPlayerResult = el("div", {
        ...modalDefaultOptions, // se hai un oggetto opzioni riusabile
        id: "playerResult"
    }); 

    // Header
    const titlePlayerResult = el("h5", {
        ...titleDefaultOptions,
        text: "Ecco che persona sei..per oggi..😉",
    });

    const btnCloseXPlayerResult = el("button", { 
        ...btnCloseXDefaultOpt,
        attrs: {
            ...btnCloseXDefaultOpt.attrs,
            name: "playerResult"
        }
    });

    const headerPlayerResult = el("div", { className: "modal-header" });
    headerPlayerResult.append(titlePlayerResult, btnCloseXPlayerResult);

    // Body
    const bodyPlayerResult = el("div", { className: "modal-body d-flex align-content-center justify-content-center" });
    const card = el("div", { 
        className: "card",
        attrs: {
            style:"width: 18rem;",
        },        
    });
    const img = el("img", {
        className: "card-img-top",
        attrs: {
            src: "",
            alt: ""
        },
    });
    const cardBody = el("div", {className: "card-body"});
    const cardh5PlayerResult = el("h5", {className: "card-title fw-bold"});
    const cardpPlayerResult = el("p", {className: "card-text text-justify"});

    bodyPlayerResult.appendChild(card);
    card.append(img, cardBody)
    cardBody.append(cardh5PlayerResult, cardpPlayerResult)

    // Footer
    const footerPlayerResult = el("div", { className: "modal-footer" });

    const btnClosePlayerResult = el("button", {
        className: "btn btn-secondary",
        attrs: {
        type: "button",
        name: "playerResult",
            "data-bs-dismiss": "modal",
        },
        text: "Chiudi",
    });

    footerPlayerResult.appendChild(btnClosePlayerResult);

    // Compose modal tree
    content.append(headerPlayerResult, bodyPlayerResult, footerPlayerResult);

    document.body.appendChild(modalPlayerResult);
}
