-- Defense-in-depth for sendMessage(): the app layer now rejects messages
-- over 2000 chars and rate-limits senders to 20/minute (see lib/actions.ts).
-- This adds the same length limit at the database level, so it holds even
-- if a request bypasses the app layer entirely (direct API call, replay, etc).

alter table public.messages
  add constraint messages_content_length check (char_length(content) <= 2000);
