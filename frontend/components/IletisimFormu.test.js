import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
render(<IletisimFormu/>)
});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu/>);
    const header =screen.queryByText("İletişim Formu");
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu/>);
    const adInput= screen.getByPlaceholderText("İlhan");
    userEvent.type(adInput,"abc");

    const error = await screen.findAllByTestId("error");
    expect(error).toHaveLength(1)
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>); 

    const button = screen.getByText(/Gönder/i);
    userEvent.click(button);
    
    const err = await screen.findAllByTestId("error");
    expect(err).toHaveLength(3);

    await waitFor(()=> {
        const err = screen.queryAllByTestId("error");
        expect(err).toHaveLength(3);

    })
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);
    const adInput= screen.getByPlaceholderText("İlhan");
    userEvent.type(adInput,"abcde");

    const soyadInput= screen.getByPlaceholderText("Mansız");
    userEvent.type(soyadInput,"abcde");

    const button = screen.getByText(/Gönder/i);
    userEvent.click(button);

    const error = await screen.findAllByTestId("error");
    expect(error).toHaveLength(1)
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);
        
    const emailInput= screen.getByLabelText(/Email*/i);
    userEvent.type(emailInput,"abcde");

    const error = await screen.findByText(/email geçerli bir email adresi olmalıdır./i);
    expect(error).toBeInTheDocument();

});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);

    const btn = screen.getByText("Gönder");
    userEvent.click(btn);
    
    const err = await screen.findByText(/Soyad gereklidir/i);
    expect(err).toBeInTheDocument();
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu/>);

    const adInput= screen.getByPlaceholderText("İlhan");
    userEvent.type(adInput,"abcde");

    const soyadInput= screen.getByPlaceholderText("Mansız");
    userEvent.type(soyadInput,"abcde");

    const emailInput= screen.getByLabelText(/Email*/i);
    userEvent.type(emailInput,"abcdefgh");

    const button = screen.getByRole("button");
    userEvent.click(button);
    
    const ad = screen.getByPlaceholderText("İlhan");
    expect(ad).toBeInTheDocument();

    const soyad = screen.getByPlaceholderText("Mansız");
    expect(soyad).toBeInTheDocument();

    const email = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
    expect(email).toBeInTheDocument();

    const message = screen.queryByTestId("messageDisplay");
    expect(message).not.toBeInTheDocument();

});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu/>);
    const ad = screen.getByLabelText("Ad*");
    const soyad = screen.getByLabelText("Soyad*");
    const mail = screen.getByLabelText("Email*");
    const mesaj = screen.getByLabelText("Mesaj");
    const btn = screen.getByRole("button");

    userEvent.type(ad, "ornek");
    userEvent.type(soyad, "soyad");
    userEvent.type(mail , "ornek@test.com");
    userEvent.type(mesaj, "mesaj");
    userEvent.click(btn);

    await waitFor(() =>{
        const name =screen.queryByText("ornek");
        expect(name).toBeInTheDocument();

        const surname =screen.queryByText("soyad");
        expect(surname).toBeInTheDocument();

        const mail =screen.getByTestId("emailDisplay");
        expect(mail).toBeInTheDocument();

        const mesaj =screen.getByTestId("messageDisplay");
        expect(mesaj).toBeInTheDocument();
    })
});
