from models.llm_message import LLMMessage
from models.presentation_layout import SlideLayoutModel
from models.presentation_outline_model import SlideOutlineModel
from services.llm_client import LLMClient
from utils.llm_provider import get_model
from utils.schema_utils import remove_fields_from_schema

system_prompt = """
    Generate structured slide based on provided title and outline, follow mentioned steps and notes and provide structured output.

    # Steps
    1. Analyze the outline and title.
    2. Generate structured slide based on the outline and title.

    # Notes
    - Slide body should not use words like "This slide", "This presentation".
    - Rephrase the slide body to make it flow naturally.
    - Provide prompt to generate image on "__image_prompt__" property.
    - Provide query to search icon on "__icon_query__" property.
    - Do not use markdown formatting in slide body.
    - Make sure to follow language guidelines.
    **Strictly follow the max and min character limit for every property in the slide.**
"""


def get_user_prompt(title: str, outline: str, language: str):
    return f"""
        ## Icon Query And Image Prompt Language
        English

        ## Slide Content Language
        {language}

        ## Slide Title
        {title}

        ## Slide Outline
        {outline}
    """


def get_messages(title: str, outline: str, language: str):

    return [
        LLMMessage(
            role="system",
            content=system_prompt,
        ),
        LLMMessage(
            role="user",
            content=get_user_prompt(title, outline, language),
        ),
    ]


async def get_slide_content_from_type_and_outline(
    slide_layout: SlideLayoutModel, outline: SlideOutlineModel, language: str
):
    client = LLMClient()
    model = get_model()

    response_schema = remove_fields_from_schema(
        slide_layout.json_schema, ["__image_url__", "__icon_url__"]
    )

    response = await client.generate_structured(
        model=model,
        messages=get_messages(
            outline.title,
            outline.body,
            language,
        ),
        response_format=response_schema,
        strict=False,
    )
    return response
