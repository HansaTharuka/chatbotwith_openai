from rest_framework.views import APIView
from rest_framework.response import Response
from openai import OpenAI

client = OpenAI(api_key=<placeholder>)

conversation_history = [{"role": "system", "content": "You are a helpful assistant."}]

class ChatBotView(APIView):
    def post(self, request):
        global conversation_history

        # Extract the user message from the request data
        user_message = request.data.get("message")
        if not user_message:
            return Response({"error": "Message not provided."}, status=400)

        # Add user message to conversation history
        conversation_history.append({"role": "user", "content": user_message})

        try:
            # Call OpenAI API
            response = client.chat.completions.create(model="gpt-3.5-turbo",
            messages=conversation_history)

            # Extract the bot's response
            bot_message = response.choices[0].message.content

            # Add the bot's response to conversation history
            conversation_history.append({"role": "assistant", "content": bot_message})

            return Response({"bot_message": bot_message})
        except Exception as e:
            return Response({"error": str(e)}, status=500)
