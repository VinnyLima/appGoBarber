import React, {
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import getValidationErrors from '../../utils/getValidationerros';
/** Componentes */
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';

/** EStilização */
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CrateAccountButton,
  CrateAccountText,
} from './styles';
import logoimg from '../../assets/logo.png';

/** Interfaces */

interface SignInFormData{
  email:string;
  password:string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInpuRef = useRef<TextInput>(null);

  const navigation = useNavigation();
  const { signIn, user } = useAuth();

  const heandleSignIn = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatorio').email('Digite um e-mail valido'),
        password: Yup.string().required('Senha obrigatoria'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
      console.log(user);
      await signIn({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const erros = getValidationErrors(err);

        formRef.current?.setErrors(erros);

        return;
      }

      Alert.alert('Erro na autenticação',
        'Ocorreu um erro ao fazer login, cheque as credenciais');
    }
  }, [signIn]);

  return (

    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView>
          <Container>
            <Image source={logoimg} />
            <View />
            <Title>Faça seu Logon</Title>
            <View />
            <Form ref={formRef} onSubmit={heandleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="Email"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInpuRef.current?.focus();
                }}

              />
              <Input
                ref={passwordInpuRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => { formRef.current?.submitForm(); }}
              />
              <Button onPress={() => { formRef.current?.submitForm(); }}>Entrar</Button>
            </Form>
            <ForgotPassword onPress={() => { console.log('Forget password'); }}>
              <ForgotPasswordText>Esqueci minha Senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>

      </KeyboardAvoidingView>

      <CrateAccountButton onPress={() => { navigation.navigate('SignUp'); }}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CrateAccountText>Criar Conta</CrateAccountText>
      </CrateAccountButton>
    </>
  );
};

export default SignIn;
