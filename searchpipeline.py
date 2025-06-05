from langchain.agents import create_openai_functions_agent, AgentExecutor
from langchain import hub
from composio_langchain import ComposioToolSet, Action, App
from langchain_openai import ChatOpenAI

llm = ChatOpenAI()
prompt = hub.pull("hwchase17/openai-functions-agent")

composio_toolset = ComposioToolSet(api_key="xvuir3kyr5rdha2q94c5h")

def firecrawl_search(query: str) -> str:
    firecrawl_tools = composio_toolset.get_tools(actions=['FIRECRAWL_SEARCH'])

    agent = create_openai_functions_agent(llm, firecrawl_tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=firecrawl_tools, verbose=True)

    result = agent_executor.invoke({"input": query})
    print(result)


