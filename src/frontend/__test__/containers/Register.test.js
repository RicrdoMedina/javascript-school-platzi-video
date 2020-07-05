import React from 'react';
import { mount } from 'enzyme';
import Register from '../../containers/Register';
import ProviderMock from '../../__mocks__/ProviderMock';

describe('<Register />', () => {
  test('Register form', () => {
    const preventDefault = jest.fn(); //Esto es un mock de jest para garantizar que llamaremos una funcion

    const register = mount(
      <ProviderMock>
        <Register />
      </ProviderMock>
    );

    register.find('form').simulate('submit', { preventDefault }); //Simular que haremos un submit y la funcion que se llamara.

    expect(preventDefault).toHaveBeenCalledTimes(1); //Verificamos que se llame una sola vez la funcion de submit

    register.unmount();
  });
});
