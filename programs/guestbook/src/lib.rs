use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod guestbook {
    use super::*;

    pub fn initialize_global(ctx: Context<InitializeGlobal>) -> Result<()> {
        ctx.accounts.global.message_count = 0;
        Ok(())
    }

    pub fn post_message(ctx: Context<PostMessage>, content: String) -> Result<()> {
        require!(!content.trim().is_empty(), GuestbookError::EmptyMessage);
        require!(content.len() <= 280, GuestbookError::MessageTooLong);

        let global = &mut ctx.accounts.global;
        let message = &mut ctx.accounts.message;
        message.author = ctx.accounts.author.key();
        message.content = content;
        message.timestamp = Clock::get()?.unix_timestamp;
        message.index = global.message_count;
        global.message_count = global
            .message_count
            .checked_add(1)
            .ok_or(GuestbookError::MessageCountOverflow)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeGlobal<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + GlobalState::INIT_SPACE,
        seeds = [b"global"],
        bump
    )]
    pub global: Account<'info, GlobalState>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PostMessage<'info> {
    #[account(mut, seeds = [b"global"], bump)]
    pub global: Account<'info, GlobalState>,
    #[account(
        init,
        payer = author,
        space = 8 + MessageAccount::INIT_SPACE,
        seeds = [b"message", global.message_count.to_le_bytes().as_ref()],
        bump
    )]
    pub message: Account<'info, MessageAccount>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct GlobalState {
    pub message_count: u64,
}

#[account]
#[derive(InitSpace)]
pub struct MessageAccount {
    pub author: Pubkey,
    #[max_len(280)]
    pub content: String,
    pub timestamp: i64,
    pub index: u64,
}

#[error_code]
pub enum GuestbookError {
    #[msg("Message must not be empty.")]
    EmptyMessage,
    #[msg("Message exceeds the 280 character limit.")]
    MessageTooLong,
    #[msg("Message count overflow.")]
    MessageCountOverflow,
}
