import React from 'react';
import { mount } from 'enzyme';
import { create } from 'react-test-renderer';
import Footer from '../../components/Footer';

describe('<Footer/>', () => {
  //A la suit le colocamos el nombre del componente

  const footer = mount(<Footer />); // Montamos nuestro componentes.

  test('Render Footer Component', () => {
    //Probar que el componente haga render
    expect(footer.length).toEqual(1);
  });

  test('Footer haves 3 anchors', () => {
    //Probar que tenga 3 elementos anchor
    expect(footer.find('a')).toHaveLength(3);
  });

  test('Footer Snapshot', () => {
    const footer = create(<Footer />); // Creamos una nueva constante footer que solo trabaje en este scope

    expect(footer.toJSON()).toMatchSnapshot(); //Creamos el snapshot. Si no esta creado lo crea y la siguiente vez compara el snapshot con el componente
  });
});
