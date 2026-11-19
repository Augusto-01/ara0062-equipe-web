<?php
    declare(strict_types=1);
    require __DIR__ . '/config/conexao.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        responder(false, 'Método não permitido.', 405);
    }
    exigirPostValido();

    $nome     = texto('nome');
    $email    = texto('email');
    $mensagem = texto('mensagem');
    $assunto  = texto('assunto') ?: 'outro';
    $copia    = isset($_POST['copia']) ? 1 : 0;

    if ($nome === '' || mb_strlen($nome) > 100) {
        responder(false, 'Informe seu nome (até 100 caracteres).', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 150) {
        responder(false, 'Informe um e-mail válido.', 422);
    }
    if (!in_array($assunto, ['duvida', 'sugestao', 'outro'], true)) {
        responder(false, 'Escolha um assunto da lista.', 422);
    }
    if ($mensagem === '' || mb_strlen($mensagem) > 2000) {
        responder(false, 'Escreva uma mensagem de até 2000 caracteres.', 422);
    }

    try {
        $stmt = conectar()->prepare(
            'INSERT INTO contatos (nome, email, assunto, mensagem, copia) VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([$nome, $email, $assunto, $mensagem, $copia]);
    } catch (PDOException $e) {
        error_log($e->getMessage());
        responder(false, 'Não foi possível salvar sua mensagem agora. Tente de novo em instantes.', 500);
    }

    responder(true, 'Mensagem enviada. Obrigado pelo contato!');