import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { SiteIcon } from "../components/icons/SiteIcon";
import { contactInfo } from "../data/siteContent";
import { formatPhone } from "../utils/formatters";
import { buildWhatsAppUrl } from "../utils/whatsapp";

type FormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const initialValues: FormValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

export function Contact() {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [statusText, setStatusText] = useState(
    "Preencha os campos para abrir a conversa com a mensagem já estruturada.",
  );
  const [isError, setIsError] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    const nextValue = name === "phone" ? formatPhone(value) : value;

    setFormValues((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.name || !formValues.email || !formValues.phone || !formValues.service || !formValues.message) {
      setStatusText("Preencha os campos obrigatórios antes de continuar.");
      setIsError(true);
      return;
    }

    const lines = [
      "Olá! Preenchi o formulário do site da ACN Contabilidade e gostaria de atendimento.",
      `Nome: ${formValues.name}`,
      `Empresa: ${formValues.company || "-"}`,
      `E-mail: ${formValues.email}`,
      `Telefone: ${formValues.phone}`,
      `Serviço: ${formValues.service}`,
      `Mensagem: ${formValues.message}`,
    ];

    setStatusText("Abrindo o WhatsApp com sua mensagem preenchida...");
    setIsError(false);

    window.open(
      buildWhatsAppUrl(contactInfo.whatsappNumber, lines.join("\n")),
      "_blank",
      "noopener,noreferrer",
    );

    setFormValues(initialValues);
  };

  return (
    <section className="contact-section" id="contato">
      <div className="section-shell contact-grid scroll-stage" data-scroll-stage>
        <div className="contact-panel scroll-reveal">
          <p className="eyebrow">Contato</p>
          <h2 className="section-title">
            Fale com a ACN no canal mais rápido para o seu próximo passo.
          </h2>
          <p>
            Se você quer abrir empresa, regularizar sua operação, entender o
            imposto de renda ou contratar assessoria contábil, o WhatsApp é o
            canal principal desta landing page.
          </p>

          <div className="contact-stack">
            <div className="contact-detail">
              <div className="contact-icon">
                <SiteIcon name="whatsapp" size={20} />
              </div>
              <div>
                <h3>WhatsApp comercial</h3>
                <a
                  href={buildWhatsAppUrl(
                    contactInfo.whatsappNumber,
                    "Olá! Quero atendimento da ACN Contabilidade.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  {contactInfo.whatsappLabel}
                </a>
              </div>
            </div>
            <div className="contact-detail">
              <div className="contact-icon">
                <SiteIcon name="mail" size={20} />
              </div>
              <div>
                <h3>E-mail</h3>
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              </div>
            </div>
            <div className="contact-detail">
              <div className="contact-icon">
                <SiteIcon name="pin" size={20} />
              </div>
              <div>
                <h3>Cobertura</h3>
                <span>{contactInfo.coverage}</span>
              </div>
            </div>
          </div>

          <div className="contact-actions">
            <a
              className="btn btn-primary"
              href={buildWhatsAppUrl(
                contactInfo.whatsappNumber,
                "Olá! Quero falar agora com a equipe da ACN Contabilidade.",
              )}
              target="_blank"
              rel="noreferrer"
            >
              <SiteIcon name="whatsapp" size={18} />
              Falar direto no WhatsApp
            </a>
            <a className="inline-link" href="#servicos">
              Voltar para os serviços
            </a>
          </div>
        </div>

        <div className="contact-card scroll-reveal">
          <div className="form-head">
            <h3>Formulário de contato</h3>
            <p>
              Ao enviar, abriremos o WhatsApp com a mensagem já preenchida para
              facilitar a conversa com a equipe.
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formValues.name}
                  placeholder="Seu nome completo"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="company">Empresa</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formValues.company}
                  placeholder="Nome da empresa ou MEI"
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  placeholder="voce@empresa.com"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Telefone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={formValues.phone}
                  placeholder="(11) 99999-9999"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field is-full">
                <label htmlFor="service">Serviço de interesse</label>
                <select
                  id="service"
                  name="service"
                  value={formValues.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um serviço</option>
                  <option value="Abertura de Empresa">Abertura de Empresa</option>
                  <option value="Imposto de Renda">Imposto de Renda</option>
                  <option value="Assessoria Contábil">Assessoria Contábil</option>
                  <option value="Regularização e Suporte Fiscal">
                    Regularização e Suporte Fiscal
                  </option>
                </select>
              </div>
              <div className="field is-full">
                <label htmlFor="message">Mensagem</label>
                <textarea
                  id="message"
                  name="message"
                  value={formValues.message}
                  placeholder="Conte, em poucas linhas, como a ACN pode ajudar."
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button className="btn btn-primary btn-block" type="submit">
              <SiteIcon name="whatsapp" size={18} />
              Enviar e falar no WhatsApp
            </button>
            <p className={`form-note ${isError ? "is-error" : ""}`}>{statusText}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
