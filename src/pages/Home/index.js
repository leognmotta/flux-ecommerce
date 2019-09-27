import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MdAddShoppingCart } from 'react-icons/md';
import api from '../../services/api';
import { formatPrice } from '../../util/format';
import * as CartActions from '../../store/modules/cart/actions';

import { ProductList } from './styles';

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class Home extends React.Component {
    state = {
      products: [],
    };

    async componentDidMount() {
      const response = await api.get('/products');

      const data = response.data.map(product => ({
        ...product,
        formattedPrice: formatPrice(product.price),
      }));

      this.setState({ products: data });
    }

    handleAddProduct = id => {
      const { addToCartRequest } = this.props;

      addToCartRequest(id);
    };

    render() {
      const { products } = this.state;
      const { amount } = this.props;
      return (
        <ProductList>
          {products.map(product => (
            <li key={product.id}>
              <img src={product.image} alt={product.title} />

              <strong>{product.title}</strong>
              <span>{product.formattedPrice}</span>

              <button
                type="button"
                onClick={() => this.handleAddProduct(product.id)}
              >
                <div>
                  <MdAddShoppingCart size={16} color="#fff" />{' '}
                  {amount[product.id] || 0}
                </div>

                <span>Adicionar ao carrinho</span>
              </button>
            </li>
          ))}
        </ProductList>
      );
    }
  }
);
