import React from 'react';
import { mount } from 'enzyme';
import { create } from 'react-test-renderer';
import Header from '../../components/Header';
import ProviderMock from '../../__mocks__/ProviderMock';

describe('<Header/>', () => {
  //Crear Suit colocando el nombre del componente

  test('Header logo image', () => {
    //Probamos que el componente se rendere y que exita un elemento con la clase header__img
    const header = mount(
      <ProviderMock>
        <Header />
      </ProviderMock>
    );

    expect(header.find('.header__img')).toHaveLength(1);
  });

  test('Header Snapshot', () => {
    //Crear snapshot del header
    const header = create(
      <ProviderMock>
        <Header />
      </ProviderMock>
    );

    expect(header.toJSON()).toMatchSnapshot();
  });
});
