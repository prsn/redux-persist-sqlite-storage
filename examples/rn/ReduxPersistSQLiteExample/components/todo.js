import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import * as TodoActions from '../actions/actions';

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  renderTodo = (props, index) => {
    return (
      <View key={index} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.listItem}>{props.text}</Text>
        <TouchableOpacity onPress={() => {
          this.props.actions.removeTodo(props.id);
        }} >
          <Text>X</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { todos = [] } = this.props;
    
    return (
      <View>
        <Text style={[styles.text]}>Add todo</Text>
        <TextInput style={[styles.input, styles.text]} value={this.state.text} onChangeText={(text) => {
          this.setState({
            text
          });
        }}/>
        <Button title="Add" onPress={() => {
          this.props.actions.addTodo({ text: this.state.text, id: Date.now() });
          this.setState({
            text: ''
          });
        }} />
        <Button title="Clear all" onPress={() => {
          this.props.actions.cleatAll();
        }} disabled={!((this.props.todos || []).length > 0)}/>
        <Text style={[styles.text]}>Todo list</Text>
        {
          todos.map((todo, index) => {
            return this.renderTodo(todo, index);
          })
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  todos: state.todo
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TodoActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Todo);

const styles = StyleSheet.create({
  input: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    borderColor: 'red',
    borderWidth: 1,
    margin: 3
  },
  text: {
    fontSize: 25
  },
  listItem: {
    fontSize: 20
  }
});
